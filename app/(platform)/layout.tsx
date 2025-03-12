import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <QueryProvider>
      {children}
      <Toaster />
      <ModalProvider />
      </QueryProvider>
    </ClerkProvider>
  );
}
