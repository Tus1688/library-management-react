import { makeRequestWithRetryReturnBoolean, makeRequestWithRetryReturnValue } from "@/routes/api";

export async function ReqCreateBook(data: {
    title: string;
    author: string;
    description: string;
}): Promise<{ id: string } | undefined> {
    const makeRequest = async () => {
        return await fetch(`/api/v1/collections/dashboard/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        })
    }

    return makeRequestWithRetryReturnValue<{id: string}>(makeRequest);
}

export async function ReqUpdateBook(data: {
    id: string;
    title: string;
    author: string;
    description: string;
}): Promise<boolean | undefined> {
    const makeRequest = async () => {
        return await fetch(`/api/v1/collections/dashboard/book`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        })
    }

    return makeRequestWithRetryReturnBoolean(makeRequest);
}