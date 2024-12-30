import BookingFeed from "@/components/booking-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { GetBookingResponse } from "@/types/booking";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

export default function BookingPage() {
    const bookings = useLoaderData() as GetBookingResponse[];

    return (
        <div>
            <Suspense fallback={<Skeleton className="h-96 relative" />}>
                <Await
                    resolve={bookings}
                    errorElement={<div>error</div>}
                    children={(booking: GetBookingResponse[]) => (
                        <BookingFeed initialData={booking} key={crypto.randomUUID()} />
                    )}
                />
            </Suspense>
        </div>
    )
}