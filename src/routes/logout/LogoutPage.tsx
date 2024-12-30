import { Button } from "@/components/ui/button";
import ReqLogout from "./api";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { ErrorResponse } from "@/types/api";
import { useAuthState } from "@/hooks/use-authenticated";

export default function LogoutPage() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const { setAuthenticated } = useAuthState();

    const handleLogout = async() => {
        try {
            const res = await ReqLogout();

            if (res) {
                toast({
                    title: "successfully logout"
                })
                navigate("/")
                setAuthenticated(false);
            }
        } catch(error) {
            const err = error as ErrorResponse;

            toast({
                title: "something went wrong",
                description: err.error,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="w-full flex justify-center items-center flex-col gap-5">
            <h1 className="pt-5">
                Are you sure you want to logout?
            </h1>
            <Button onClick={() => handleLogout()}>
                Logout
            </Button>
        </div>
    );
}