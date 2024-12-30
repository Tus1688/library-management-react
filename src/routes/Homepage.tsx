import BookFeed from "@/components/book-feed";
import ErrorPage from "@/components/error-page";
import { Skeleton } from "@/components/ui/skeleton";
import { GetBookResponse } from "@/types/book";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

export default function Homepage() {
  const books = useLoaderData() as GetBookResponse[];

  return (
    <div className="w-full flex items-center justify-center">
      <div className="max-w-screen-lg">
        <Suspense fallback={<Skeleton className="h-96 relative" />}>
          <Await
            resolve={books}
            errorElement={<ErrorPage />}
            children={(book: GetBookResponse[]) => (
              <BookFeed initialData={book} key={book[0]?.id} />
            )}
          />
        </Suspense>
      </div>
    </div>
  );
}