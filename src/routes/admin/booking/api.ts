import { GetBookingResponse } from "@/types/booking";
import { makeRequestWithRetryReturnBoolean, makeRequestWithRetryReturnValue, makeRequestWithRetrySilent404 } from "../../api";

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

export async function ReqCreateBooking(data: {
    book_id: string;
    customer_name: string;
    customer_phone: string
}): Promise<{id: string} | undefined> {
    const makeRequest = async () => {
        return await fetch(`/api/v1/collections/dashboard/booking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        })
    }

    return makeRequestWithRetryReturnValue<{id: string}>(makeRequest);
}

export async function ReqReturnBook(id: string): Promise<boolean | undefined> {
    const makeRequest = async() => {
        return await fetch(`/api/v1/collections/dashboard/return?id=${id}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })
    }

    return makeRequestWithRetryReturnBoolean(makeRequest);
}