import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function ClerkAuthLayout({ children }:{ children: ReactNode }) {
    return <ClerkProvider>
        <div className="min-h-screen flex flex-col justify-center items-center">{children}</div>
    </ClerkProvider>
}