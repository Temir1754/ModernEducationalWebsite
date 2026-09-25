import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { z } from "zod";
import { Loader2, LogOut, Shield, ShieldCheck, FileText, Home } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const credentialsSchema = z
    .object({
        newUsername: z
            .string()
            .trim()
            .regex(/^[A-Za-z0-9_.-]{3,50}$/, "Логин 3–50 таңбадан тұруы керек: латын әріптері, сандар, _ . -"),
        newPassword: z.string().min(8, "Құпиясөз кемінде 8 таңбадан тұруы керек").max(100),
        confirmPassword: z.string(),
        currentPassword: z.string().min(1, "Қазіргі құпиясөзді енгізіңіз"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Құпиясөздер сәйкес келмейді",
        path: ["confirmPassword"],
    });

type CredentialsData = z.infer<typeof credentialsSchema>;

const inputClass = "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-11";

const roleText = {
    admin: { icon: Shield, title: "Әкімші кабинеті", linkIcon: Home, linkHref: "/", linkLabel: "Сайтқа өту" },
    inspector: { icon: ShieldCheck, title: "Тексеруші кабинеті", linkIcon: FileText, linkHref: "/school-documents", linkLabel: "Аттестаттау материалдары" },
};

// Account page for a logged-in admin or inspector: shortcut link, own login/password change, logout.
export default function AccountPage({ role }: { role: keyof typeof roleText }) {
    const { user, logoutMutation } = useAuth();
    const { toast } = useToast();
    const text = roleText[role];
    const Icon = text.icon;
    const LinkIcon = text.linkIcon;

    const form = useForm<CredentialsData>({
        resolver: zodResolver(credentialsSchema),
        defaultValues: {
            newUsername: user?.username ?? "",
            newPassword: "",
            confirmPassword: "",
            currentPassword: "",
        },
    });

    const saveMutation = useMutation({
        mutationFn: async ({ newUsername, newPassword, currentPassword }: CredentialsData) => {
            const res = await fetch("/api/auth/credentials", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ newUsername, newPassword, currentPassword }),
            });
            const body = await res.json();
            if (!res.ok) {
                throw new Error(body.message);
            }
            return body;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["/api/auth/me"], data);
            form.reset({ newUsername: data.user.username, newPassword: "", confirmPassword: "", currentPassword: "" });
            toast({ title: "Сақталды", description: "Жаңа логин мен құпиясөз сақталды." });
        },
        onError: (error: Error) => {
            toast({ title: "Қате", description: error.message, variant: "destructive" });
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

            <Card className="w-full max-w-md relative z-10 border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl animate-fade-in-up">
                <CardHeader className="space-y-4 pb-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
                        {text.title}
                    </CardTitle>
                    <p className="text-center text-gray-600 text-sm">
                        Сіз <span className="font-semibold text-gray-900">{user?.username}</span> ретінде кірдіңіз.
                    </p>
                    <Link
                        href={text.linkHref}
                        className="flex items-center justify-center gap-2 h-11 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200"
                    >
                        <LinkIcon className="w-5 h-5" />
                        {text.linkLabel}
                    </Link>
                </CardHeader>

                <CardContent className="pt-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-t border-gray-200 pt-6">
                        Логин мен құпиясөзді өзгерту
                    </h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="newUsername"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-medium">Жаңа логин</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoComplete="username" className={inputClass} />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-medium">Жаңа құпиясөз</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" autoComplete="new-password" className={inputClass} placeholder="Кемінде 8 таңба" />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-medium">Жаңа құпиясөзді қайталаңыз</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" autoComplete="new-password" className={inputClass} />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-medium">Қазіргі құпиясөз</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" autoComplete="current-password" className={inputClass} />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-semibold"
                                disabled={saveMutation.isPending}
                            >
                                {saveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Сақтау"}
                            </Button>
                        </form>
                    </Form>

                    <Button
                        variant="ghost"
                        className="w-full mt-3 text-gray-600 hover:text-red-600"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Шығу
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
