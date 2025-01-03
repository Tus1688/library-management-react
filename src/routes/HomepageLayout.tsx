import { Link, Outlet, useLocation } from "react-router";
import { ModeToggle } from "../components/mode-toggle";
import { Toaster } from "../components/ui/toaster";
import { cn } from "@/lib/utils";
import { useState } from "react";

function HomepageLayout() {
  const location = useLocation();
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <div className="lg:space-x-6 flex flex-row items-start justify-center w-full min-h-dvh font-sans antialiased bg-background">
      <div className="w-screen h-full max-w-screen-xl">
        <div className="flex justify-between align-center py-2 sticky top-0 z-10 bg-background px-2 lg:px-0">
          <Link className="font-mono font-bold text-2xl" to={"/"}>Dream Library</Link>
          <div className="flex gap-4 items-center">
            <Link to='/admin' className={cn("font-mono text-sm", location.pathname === "/admin" ? "font-bold" : "")}>
              Booking
            </Link>
            <Link to='/admin/book' className={cn("font-mono text-sm", location.pathname === "/admin/book" ? "font-bold" : "")}>
              Books
            </Link>
            <Link to='/admin/employee' className={cn("font-mono text-sm", location.pathname === "/admin/employee" ? "font-bold" : "")}>
              Admin
            </Link>
            {isAuthenticated? (
              <Link to="/auth/logout" className="font-mono text-sm">Logout</Link>
            ) : null}
            <ModeToggle />
          </div>
        </div>
        <Outlet context={{ isAuthenticated, setAuthenticated }}/>
        <Toaster />
      </div>
    </div>
  );
}

export default HomepageLayout
