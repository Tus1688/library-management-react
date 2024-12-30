import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { ReqLogin } from "./api";
import { useNavigate } from "react-router";
import { ErrorResponse } from "@/types/api";

const FormSchema = z.object({
    username: z.string().min(1, {
        message: "Username must be at least 1 characters."
    }),
    password: z.string().min(1, {
        message: "Password must be at least 1 characters."
    })
})

export default function LoginPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
    
        try {
            const res = await ReqLogin(data);

            if (res) {
                localStorage.setItem("isLoggedIn", "true");
                toast({
                    title: `Welcome back, ${data.username}`
                })
                navigate("/admin");
            }
        } catch(error) {
            const errorRes = error as ErrorResponse;

            if (errorRes.error) {
                toast({
                    title: "Error on login",
                    description: `${errorRes.error}`,
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <div className="flex justify-center items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl flex-1 px-4 pt-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="admin" {...field} />
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
                                    <Input type="password" placeholder="***" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="mt-5">
                        {isLoading ?? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> }
                        Login
                        </Button>
                </form>
            </Form>
        </div>
    );
}