import AdminBookFeed from "@/components/admin-book-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { GetBookResponse } from "@/types/book";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

export default function BookPage() {
    const books = useLoaderData() as GetBookResponse[];

    return (
        <div>
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