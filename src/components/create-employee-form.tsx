import { useToast } from '@/hooks/use-toast';
import { ReqCreateEmployee } from '@/routes/admin/employee/api';
import { ErrorResponse } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Icons } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';

const FormSchema = z.object({
    username: z.string().min(1, {
        message: "Username must be at least 1 characters"
    }),
    password: z.string().min(1, {
        message: "Password must be at least 1 characters"
    })
})

export default function CreateEmployeeForm({
    setOpen
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const revalidate = useRevalidator();

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
            const res = await ReqCreateEmployee(data);

            if (res?.id) {
                toast({
                    title: "employee added"
                })
                revalidate.revalidate()
                setOpen(false);
            }
        } catch (error) {
            const errorRes = error as ErrorResponse
            if (errorRes.error) {
                toast({
                    title: "Error on creating",
                    description: `${errorRes.error}`,
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                    <Input placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="mt-5">
                        {isLoading ?? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Add
                    </Button>
                </form>
            </Form>
        </div>
    )
}