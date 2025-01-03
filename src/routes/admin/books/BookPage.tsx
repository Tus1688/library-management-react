import AdminBookFeed from "@/components/admin-book-feed";
import CreateBookForm from "@/components/create-book-form";
import ErrorPage from "@/components/error-page";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { GetBookResponse } from "@/types/book";
import { PlusIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { Await, useLoaderData } from "react-router";

export default function BookPage() {
    const books = useLoaderData() as GetBookResponse[];
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-end">
                <Sheet defaultOpen={false} open={open} onOpenChange={setOpen}>
                    <SheetTrigger>
                        <Button>
                            <PlusIcon />
                            New Book
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <CreateBookForm setOpen={setOpen} />
                    </SheetContent>
                </Sheet>
            </div>
            <Suspense fallback={<Skeleton className="h-96 relative" />}>
                <Await
                    resolve={books}
                    errorElement={<ErrorPage />}
                    children={(books: GetBookResponse[]) => (
                        <AdminBookFeed initialData={books} key={crypto.randomUUID()} />
                    )}
                />
            </Suspense>
        </div>
    );
}