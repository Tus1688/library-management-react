import { makeRequestWithRetryReturnBoolean } from "../api";

export default function ReqLogout(): Promise<boolean | undefined> {
    const makeRequest = async() => {
        return await fetch(`/api/v1/auth/logout`, {
            method: "POST"
        })
    };

    return makeRequestWithRetryReturnBoolean(makeRequest);
}