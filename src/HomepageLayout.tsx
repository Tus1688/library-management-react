import { Outlet } from "react-router";
import { ModeToggle } from "./components/mode-toggle";
import { Toaster } from "./components/ui/toaster";

function HomepageLayout() {
  return (
    <div className="lg:space-x-6 flex flex-row items-start justify-center w-full min-h-dvh font-sans antialiased bg-background">
      <div className="max-w-screen-lg w-screen h-full ">
        <div className="flex justify-between align-center py-2 sticky top-0 z-10 bg-background px-2 lg:px-0">
          <h1 className="font-mono font-bold text-2xl">Dream Library</h1>
          <ModeToggle />
        </div>
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
}

export default HomepageLayout
