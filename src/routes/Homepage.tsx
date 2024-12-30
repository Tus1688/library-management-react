import BookFeed from "@/components/book-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { GetBookResponse } from "@/types/book";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

export default function Homepage() {
  const books = useLoaderData() as GetBookResponse[];

  return (
    <div>
      <Suspense fallback={<Skeleton className="h-96 relative" />}>
        <Await
          resolve={books}
          errorElement={<div>error</div>}
          children={(book: GetBookResponse[]) => (
            <BookFeed initialData={book} key={book[0]?.id} />
          )}
        />
      </Suspense>
    </div>
  );
}