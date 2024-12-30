import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Icons } from './icons';
import { ReqCreateBook } from '@/routes/admin/books/api';
import { ErrorResponse } from '@/types/api';

const FormSchema = z.object({
    title: z.string().min(1, {
        message: "Title must be at least 1 characters"
    }),
    author: z.string().min(1, {
        message: "Author must be at least 1 characters"
    }),
    description: z.string().min(1, {
        message: "Description must be at least 1 characters"
    }),
})

export default function CreateBookForm({
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
            title: "",
            author: "",
            description: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);

        try {
            const res = await ReqCreateBook(data);

            if (res?.id) {
                toast({
                    title: "book added to collections"
                })
                revalidate.revalidate()
                setOpen(false);
            }
        } catch (error) {
            const errorRes = error as ErrorResponse
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
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="book title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl>
                                    <Input placeholder="book author" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="book description" {...field} />
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