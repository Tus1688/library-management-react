import { GetBookingResponse } from "@/types/booking";
import { makeRequestWithRetrySilent404 } from "../../api";

export async function ReqBooking(data: {
    limit?: number;
    last_id?: number;
}): Promise<GetBookingResponse[] | undefined> {
    const url = new URL("/api/v1/collections/dashboard/booking", window.location.origin);
    const { limit, last_id } = data;

    if (limit !== undefined) {
        url.searchParams.append("limit", limit.toString());
    }

    if (last_id !== undefined) {
        url.searchParams.append("last_id", last_id.toString());
    }

    return makeRequestWithRetrySilent404<GetBookingResponse[]>(() =>
        fetch(url.toString(), { method: "GET" })
    );
}