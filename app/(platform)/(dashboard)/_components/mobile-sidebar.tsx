"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "./Sidebar"

export function MobileSidebar() {
    const pathname = usePathname()
    const [isMounted, setIsMounted] = useState(false)
    const { isOpen, onOpen, onClose } = useMobileSidebar((state) => state)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        onClose()
    }, [pathname, onClose])

    if(!isMounted) {
        return null
    }

    return (
        <>
            <Button 
            onClick={onOpen} 
            className="block md:hidden mr-2"
            variant="ghost"
            >
                <Menu className="h-4 w-4" />
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetTitle></SheetTitle>
                <SheetContent side="left" className="p-2 pt-10">
                    <Sidebar
                        storageKey="t-sidebar-mobile-state"
                    />
                </SheetContent>
            </Sheet>
        </>
    )
}