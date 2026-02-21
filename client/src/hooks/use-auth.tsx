import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { insertUserSchema, User, InsertUser } from "@shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: any;
    logoutMutation: any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    // queryClient is imported at top level

    const { data, error, isLoading } = useQuery<{ user: User } | undefined, Error>({
        queryKey: ["/api/auth/me"],
        retry: false,
    });

    const user = data?.user ?? null;

    const loginMutation = useMutation({
        mutationFn: async (credentials: Pick<InsertUser, "username" | "password">) => {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            if (!res.ok) {
                throw new Error((await res.json()).message);
            }

            return res.json();
        },
        onSuccess: (data: { user: User }) => {
            queryClient.setQueryData(["/api/auth/me"], data);
            toast({
                title: "Login successful",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await fetch("/api/auth/logout", {
                method: "POST",
            });
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/auth/me"], null);
            toast({
                title: "Logged out",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                loginMutation,
                logoutMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
