import { ErrorResponse } from "@/types/api";
import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router";

export default function RootErrorPage() {
    const error = useRouteError() as ErrorResponse;
    const navigate = useNavigate();

    
    useEffect(() => {
        if (error.status === 401) {
            navigate("/auth/login");
            console.log("redirecting to login page");
        }
    });

    return (
        <div className="w-full h-06 flex flex-col justify-center items-center text-center"> 
            <h1 className="text-xl font-bold">
                Something went wrong ({error.status})
            </h1>
        </div>
    );
}