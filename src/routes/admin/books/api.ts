import { makeRequestWithRetryReturnValue } from "@/routes/api";

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
