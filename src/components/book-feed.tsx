import { useToast } from "@/hooks/use-toast";
import { ReqPublicBook } from "@/routes/api";
import { ErrorResponse } from "@/types/api";
import { GetBookResponse } from "@/types/book";
import { useEffect, useRef, useState } from "react";
import BookCard from "./book-card";
import { Button } from "./ui/button";

export default function BookFeed({
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
            {data.map((book) => (
                <div>
                    <BookCard book={book} />
                </div>
            ))}
            {hasMoreData ? (
                <Button ref={loadMoreRef} className={"py-24"} variant={"ghost"} onClick={() => loadMore()}
                    disabled={isLoading}>
                    {isLoading ? "Loading..." : "Load More"}
                </Button>
            ) : (
                <p className={"text-center text-muted-foreground py-8"}>No more book to show</p>
            )}
        </div>
    )
}