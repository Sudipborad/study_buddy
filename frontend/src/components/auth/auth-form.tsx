"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "../icons";
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(1, { message: "Name is required." }),
});

export function AuthForm({
  mode: initialMode = "login",
}: {
  mode?: "login" | "register";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const router = useRouter();
  const { toast } = useToast();
  const { signUp, signIn } = useAuth();

  const currentSchema = mode === "register" ? registerSchema : loginSchema;
  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      if (mode === "register") {
        await signUp(values.email, values.password, values.name);
        toast({
          title: "Registration Successful",
          description: "You're being redirected to your dashboard.",
        });
        router.push("/dashboard");
      } else {
        await signIn(values.email, values.password);
        toast({
          title: "Login Successful",
          description: "You're being redirected to your dashboard.",
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description:
          error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 font-bold text-xl mb-4">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline">StudyBuddy</span>
        </div>
        <CardTitle className="font-headline text-2xl">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to access your account."
            : "Enter your email and password to get started."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === "register" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "login" ? "Log In" : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <Button
            variant="link"
            asChild
            className="p-1 text-accent hover:text-accent/80"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            <button type="button">
              {mode === "login" ? "Register" : "Log In"}
            </button>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
