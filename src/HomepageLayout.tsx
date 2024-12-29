import { Outlet } from "react-router";
import { ModeToggle } from "./components/mode-toggle";

function HomepageLayout() {
  return (
    <div className="lg:space-x-6 flex flex-row items-start justify-center w-full min-h-dvh font-sans antialiased bg-background">
      <div className="max-w-screen-lg w-screen h-full px-2 sm:px-0">
        <div className="flex justify-between align-center py-2 sticky top-0 z-10 bg-background">
          <h1 className="font-mono font-bold text-2xl">Dream Library</h1>
          <ModeToggle />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default HomepageLayout
