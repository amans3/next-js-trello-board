"use client"

import { useEffect, useState } from "react"
import { CardModal } from "../modals/card-modal"
import { ProModal } from "../modals/pro-modal"

export function ModalProvider() {
    const [mounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!mounted) {
        return null
    }
    
    return (
        <div>
            <CardModal />
            <ProModal />
        </div>
    )
}