import { makeRequestWithRetryReturnBoolean, makeRequestWithRetryReturnValue, makeRequestWithRetrySilent404 } from "@/routes/api";
import { GetEmployeeResponse } from "@/types/employee";

export async function ReqGetEmployee(): Promise<GetEmployeeResponse[] | undefined> {
    const makeRequest = async () => {
        return await fetch(`/api/v1/auth/dashboard/user`, {
            method: "GET"
        })
    }

    return makeRequestWithRetrySilent404<GetEmployeeResponse[]>(makeRequest);
}

export async function ReqCreateEmployee(data: {
    username: string;
    password: string;
}): Promise<{ id: string; } | undefined> {
    const makeRequest = async () => {
        return await fetch(`/api/v1/auth/dashboard/user`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    return makeRequestWithRetryReturnValue<{ id: string }>(makeRequest);
}

export async function ReqDeleteEmployee(id: string): Promise<boolean | undefined> {
    const makeRequest = async () => {
        return await fetch(`/api/v1/auth/dashboard/user?id=${id}`, {
            method: "DELETE"
        })
    }

    return makeRequestWithRetryReturnBoolean(makeRequest);
}