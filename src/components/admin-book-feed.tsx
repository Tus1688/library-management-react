import { useToast } from "@/hooks/use-toast";
import { ReqPublicBook } from "@/routes/api";
import { ErrorResponse } from "@/types/api";
import { GetBookResponse } from "@/types/book";
import { useState, useRef, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import UpdateBookForm from "./update-book-form";
import CreateBookingForm from "./create-booking-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useRevalidator } from "react-router";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { ReqDeleteBook } from "@/routes/admin/books/api";

export default function AdminBookFeed({
    initialData,
}: {
    initialData: GetBookResponse[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<GetBookResponse[]>(initialData);
    const lastIdRef = useRef<number | undefined>(data[data.length - 1]?.pagination_id);

    const [hasMoreData, setHasMoreData] = useState(true);

    const loadMoreRef = useRef<HTMLButtonElement | null>(null);

    const { toast } = useToast();

    const loadMore = async () => {
        if (isLoading || !hasMoreData) return; // prevent redundant network requests
        setIsLoading(true);

        try {
            const res = await ReqPublicBook({ limit: 10, last_id: lastIdRef.current });

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
                        <TableHead className="max-w-96">Title</TableHead>
                        <TableHead className="max-w-96">Author</TableHead>
                        <TableHead className="max-w-96">Description</TableHead>
                        <TableHead>Booked Until</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((book) => (
                        <TableRowData data={book} />
                    ))}
                </TableBody>
            </Table>
            {hasMoreData ? (
                <Button ref={loadMoreRef} className={"py-24"} variant={"ghost"} onClick={() => loadMore()}
                    disabled={isLoading}>
                    {isLoading ? "Loading..." : "Load More"}
                </Button>
            ) : (
                <p className={"text-center text-muted-foreground py-8"}>No more book to show</p>
            )}
        </div>
    );
}

function TableRowData({ data }: { data: GetBookResponse }) {
    const {toast} = useToast();
    const revalidate = useRevalidator();
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openBooking, setOpenBooking] = useState(false);

    async function handleDelete(id: string)  {
        try {
            const res = await ReqDeleteBook(id);

            if (res) {
                toast({
                    title: "book deleted"
                })
                revalidate.revalidate()
                setOpenDelete(false);
            }
        } catch (error) {
            const errorRes = error as ErrorResponse
            if (errorRes.error) {
                toast({
                    title: "Error on deleting",
                    description: `${errorRes.error}`,
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <TableRow>
            <TableCell className="max-w-96 break-all">{data.title}</TableCell>
            <TableCell className="max-w-96 break-all">{data.author}</TableCell>
            <TableCell className="max-w-96 break-all">{data.description}</TableCell>
            <TableCell>{data.booked_until ? (
                <Badge variant="destructive">{new Date(data.booked_until).toLocaleString()}</Badge>
            ) : (
                <Badge>Not booked</Badge>
            )}</TableCell>
            <TableCell>{new Date(data.created_at).toLocaleString()}</TableCell>
            <TableCell>{new Date(data.updated_at).toLocaleString()}</TableCell>
            <TableCell className="flex gap-2">
                <Sheet open={openUpdate} onOpenChange={setOpenUpdate}>
                    <SheetTrigger>
                        <Button size={"icon"}>
                            <Edit2Icon size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <UpdateBookForm data={data} setOpen={setOpenUpdate} />
                    </SheetContent>
                </Sheet>
                <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogTrigger>
                        <Button size={"icon"} variant={"destructive"}>
                            <Trash2Icon size={24} />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will delete the book forever.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(data.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Sheet open={openBooking} onOpenChange={setOpenBooking}>
                    <SheetTrigger disabled={data.is_booked}>
                        <Button size={"sm"} disabled={data.is_booked}>
                            Booking
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <CreateBookingForm data={data} setOpen={setOpenBooking} />
                    </SheetContent>
                </Sheet>
            </TableCell>
        </TableRow>
    )
}