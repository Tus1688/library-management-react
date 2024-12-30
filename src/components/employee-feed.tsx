import { useToast } from "@/hooks/use-toast";
import { GetEmployeeResponse } from "@/types/employee";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ErrorResponse } from "@/types/api";
import { useState } from "react";
import { useRevalidator } from "react-router";
import { ReqDeleteEmployee } from "@/routes/admin/employee/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";

export default function EmployeeFeed({
    initialData,
}: {
    initialData: GetEmployeeResponse[];
}) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialData.map((employee) => (
                        <TableRowData data={employee} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function TableRowData({data} : {data: GetEmployeeResponse}) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const revalidate = useRevalidator();

    async function handleDelete(id: string) {
        try {
            const res = await ReqDeleteEmployee(id);

            if (res) {
                toast({
                    title: "Employee deleted"
                })
                revalidate.revalidate()
                setOpen(false);
            }
        } catch (error) {
            const errorRes = error as ErrorResponse
            if (errorRes.error) {
                toast({
                    title: "Error on deleted",
                    description: `${errorRes.error}`,
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <TableRow>
            <TableCell>{data.username}</TableCell>
            <TableCell>{new Date(data.created_at).toLocaleString()}</TableCell>
            <TableCell>{new Date(data.updated_at).toLocaleString()}</TableCell>
            <TableCell>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger>
                        <Button variant="destructive" size="icon">
                            <Trash2Icon />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. 
                                This will delete the employee permanently
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(data.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TableCell>
        </TableRow>
    )
}