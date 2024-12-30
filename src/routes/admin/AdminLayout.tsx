import { Outlet } from "react-router";

export default function AdminLayout() {
    return (
        <div className="pt-4">
            <Outlet />
        </div>
    );
}