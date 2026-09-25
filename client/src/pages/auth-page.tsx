import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield, ShieldCheck } from "lucide-react";
import { z } from "zod";
import AccountPage from "@/pages/account-page";

const loginSchema = z.object({
    username: z.string().min(1, "Логинді енгізіңіз"),
    password: z.string().min(1, "Құпиясөзді енгізіңіз"),
});

type LoginData = z.infer<typeof loginSchema>;

const variants = {
    admin: {
        icon: Shield,
        title: "Admin Login",
        subtitle: "Welcome back! Please enter your credentials.",
        username: "Username",
        password: "Password",
        submit: "Sign In",
    },
    inspector: {
        icon: ShieldCheck,
        title: "Тексерушілер үшін кіру",
        subtitle: "Мемлекеттік аттестаттау материалдарын қарау үшін логин мен құпиясөзді енгізіңіз.",
        username: "Логин",
        password: "Құпиясөз",
        submit: "Кіру",
    },
};

export default function AuthPage({ variant = "admin" }: { variant?: keyof typeof variants }) {
    const { user, loginMutation } = useAuth();
    const [, setLocation] = useLocation();
    const text = variants[variant];
    const Icon = text.icon;

    // A logged-in inspector stays on /inspector and sees their account page.
    // An admin goes straight to the home page to edit content; the account page is at /account.
    const showAccount = variant === "inspector" && user?.role === "inspector";

    useEffect(() => {
        if (!user || showAccount) return;
        setLocation(user.role === "admin" ? "/" : "/school-documents");
    }, [user, showAccount, setLocation]);

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    function onSubmit(data: LoginData) {
        loginMutation.mutate(data);
    }

    if (showAccount) {
        return <AccountPage role="inspector" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white py-12 px-4 sm:px-6 lg:px-8">
            {/* Premium background mesh gradients */}
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
                        {text.subtitle}
                    </p>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-medium">{text.username}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                autoComplete="username"
                                                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
                                                placeholder={text.username}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-medium">{text.password}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                autoComplete="current-password"
                                                {...field}
                                                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
                                                placeholder="••••••••"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-600/20 border-0 transition-all duration-200 transform hover:-translate-y-0.5"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    text.submit
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
