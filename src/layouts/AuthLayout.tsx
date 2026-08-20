import { Outlet } from "react-router-dom";
import { Logo } from "../components/ui";

export function AuthLayout() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-midnight p-8">
      <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan/10 blur-[140px]" />
      <div className="absolute left-8 top-7">
        <Logo />
      </div>
      <Outlet />
    </div>
  );
}
