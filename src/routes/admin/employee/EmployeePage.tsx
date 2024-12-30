import CreateEmployeeForm from "@/components/create-employee-form";
import EmployeeFeed from "@/components/employee-feed";
import ErrorPage from "@/components/error-page";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { GetEmployeeResponse } from "@/types/employee";
import { PlusIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { Await, useLoaderData } from "react-router";

export default function EmployeePage() {
    const employees = useLoaderData() as GetEmployeeResponse[];
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-end">
                <Sheet defaultOpen={false} open={open} onOpenChange={setOpen}>
                    <SheetTrigger>
                        <Button>
                            <PlusIcon />
                            New Employee
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <CreateEmployeeForm setOpen={setOpen} />
                    </SheetContent>
                </Sheet>
            </div>
            <Suspense fallback={<Skeleton className="h-96 relative" />}>
                <Await
                    resolve={employees}
                    errorElement={<ErrorPage />}
                    children={(employee: GetEmployeeResponse[]) => (
                        <EmployeeFeed initialData={employee} key={crypto.randomUUID()} />
                    )}
                />
            </Suspense>
        </div>
    )
}