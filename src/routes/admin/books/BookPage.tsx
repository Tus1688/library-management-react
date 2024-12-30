import AdminBookFeed from "@/components/admin-book-feed";
import CreateBookForm from "@/components/create-book-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { GetBookResponse } from "@/types/book";
import { Suspense, useState } from "react";
import { Await, useLoaderData } from "react-router";

export default function BookPage() {
    const books = useLoaderData() as GetBookResponse[];
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Sheet defaultOpen={false} open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Button>
                        New Book
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <CreateBookForm setOpen={setOpen} />
                </SheetContent>
            </Sheet>
            <Suspense fallback={<Skeleton className="h-96 relative" />}>
                <Await
                    resolve={books}
                    errorElement={<div>error</div>}
                    children={(books: GetBookResponse[]) => (
                        <AdminBookFeed initialData={books} key={books[0]?.id} />
                    )}
                />
            </Suspense>
        </div>
    );
}