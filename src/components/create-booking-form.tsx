import { useToast } from '@/hooks/use-toast';
import { ErrorResponse } from '@/types/api';
import { GetBookResponse } from '@/types/book';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRevalidator } from 'react-router';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Icons } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ReqCreateBooking } from '@/routes/admin/booking/api';

const FormSchema = z.object({
    book_id: z.string(),
    customer_name: z.string().min(1, {
        message: "Customer name must be at least 1 characters"
    }),
    customer_phone: z.string().min(1, {
        message: "Customer Phone must be at least 1 characters"
    }),
})
export default function CreateBookingForm({
    setOpen,
    data,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: GetBookResponse;
}) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const revalidate = useRevalidator();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            book_id: data.id,
            customer_name: "",
            customer_phone: ""
        }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);

        try {
            const res = await ReqCreateBooking(data);

            if (res) {
                toast({
                    title: "booked successfully"
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
                        name="customer_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Customer Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="customer name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customer_phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Customer Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="customer phone" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="mt-5">
                        {isLoading ?? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Book
                    </Button>
                </form>
            </Form>
        </div>
    )
}