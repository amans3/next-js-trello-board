import { ReactNode } from "react";
import Navbar from "./_components/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
}
