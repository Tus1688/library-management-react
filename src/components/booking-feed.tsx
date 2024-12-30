import { useToast } from "@/hooks/use-toast";
import { ReqBooking, ReqReturnBook } from "@/routes/admin/booking/api";
import { ErrorResponse } from "@/types/api";
import { GetBookingResponse } from "@/types/booking";
import { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useRevalidator } from "react-router";

export default function BookingFeed({
    initialData,
}: {
    initialData: GetBookingResponse[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<GetBookingResponse[]>(initialData);
    const lastIdRef = useRef<number | undefined>(data[data.length - 1]?.pagination_id);

    const [hasMoreData, setHasMoreData] = useState(true);

    const loadMoreRef = useRef<HTMLButtonElement | null>(null);

    const { toast } = useToast();


    const loadMore = async () => {
        if (isLoading || !hasMoreData) return; // prevent redundant network requests
        setIsLoading(true);

        try {
            const res = await ReqBooking({ limit: 10, last_id: lastIdRef.current });

            if (res) {
                if (res.length === 0) {
                    setHasMoreData(false);
                    return;
                }

                setData((prev) => {
                    return [...prev, ...res]

                })
                lastIdRef.current = res[res.length - 1].pagination_id;
            }
        } catch (error) {
            const err = error as ErrorResponse;
            if (err.status === 404) {
                setHasMoreData(false);
            }

            toast({
                title: "something went wrong",
                description: err.error,
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!loadMoreRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    });

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="max-w-96 break-all">Book Title</TableHead>
                        <TableHead>Book Author</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Customer Phone</TableHead>
                        <TableHead>Booked Until</TableHead>
                        <TableHead>Returned</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>Updated By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((booking) => (
                        <TableRowData data={booking} />
                    ))}
                </TableBody>
            </Table>
            {hasMoreData ? (
                <Button ref={loadMoreRef} className={"py-24"} variant={"ghost"} onClick={() => loadMore()}
                    disabled={isLoading}>
                    {isLoading ? "Loading..." : "Load More"}
                </Button>
            ) : (
                <p className={"text-center text-muted-foreground py-8"}>No more booking to show</p>
            )}
        </div>
    )
}

function TableRowData({ data }: { data: GetBookingResponse }) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const revalidate = useRevalidator();

    async function handleReturn(id: string) {
        try {
            const res = await ReqReturnBook(id);

            if (res) {
                toast({
                    title: "book set to returned"
                })
                revalidate.revalidate()
                setOpen(false);
            }
        } catch (error) {
            const errorRes = error as ErrorResponse
            if (errorRes.error) {
                toast({
                    title: "Error on updating",
                    description: `${errorRes.error}`,
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <TableRow>
            <TableCell className="max-w-96 break-all">{data.book_title}</TableCell>
            <TableCell>{data.book_author}</TableCell>
            <TableCell>{data.customer_name}</TableCell>
            <TableCell>{data.customer_phone}</TableCell>
            <TableCell>{new Date(data.booked_until).toLocaleDateString()}</TableCell>
            <TableCell>{data.is_returned ? (
                <Badge variant={"default"}>Yes</Badge>
            ) : (
                <Badge variant={"destructive"}>Haven't</Badge>
            )}</TableCell>
            <TableCell>{new Date(data.created_at).toLocaleString()}</TableCell>
            <TableCell>{new Date(data.updated_at).toLocaleString()}</TableCell>
            <TableCell>{data.updated_by}</TableCell>
            <TableCell>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger disabled={data.is_returned}>
                        <Button size={"sm"} disabled={data.is_returned}>
                            Return
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. 
                                This will mark this book to be returned and update the booking status.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleReturn(data.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </TableCell>
        </TableRow>
    )
}