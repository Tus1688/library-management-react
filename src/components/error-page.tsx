import { useAuthState } from "@/hooks/use-authenticated";
import { ErrorResponse } from "@/types/api";
import { useEffect } from "react";
import { useAsyncError, useNavigate } from "react-router";

export default function ErrorPage() {
    const error = useAsyncError() as ErrorResponse;
    const navigate = useNavigate();

    const { setAuthenticated } = useAuthState();

    useEffect(() => {
        if (error.status === 401) {
            navigate("/auth/login");
            setAuthenticated(false);
        }
    })

    return (
        <div className="w-full h-06 flex flex-col justify-center items-center text-center">
            <h1 className="text-xl font-bold">
                Something went wrong
            </h1>
        </div>
    );
}