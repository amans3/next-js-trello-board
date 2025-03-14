"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useProModal } from "@/hooks/use-pro-modal"
import Image from "next/image"
import { Button } from "../ui/button"
import { useAction } from "@/hooks/use-actions"
import { stripeRedirect } from "@/actions/stripe-redirect/stripeRedirect"
import { toast } from "sonner"


export function ProModal() {
    const proModal = useProModal()

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data
        },
        onError: (error) => {
            toast.error(error)
        }
    })


    function onClick() {
        execute({})
    }

    return (
        <Dialog
            open={proModal.isOpen}
            onOpenChange={proModal.onClose}
        >
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <DialogTitle className="text-center text-3xl mt-4 text-sky-900"></DialogTitle>
            <div className="aspect-video relative flex items-center justify-center">
                <Image src="/trello.jpg" alt="Trello Subscription" className="object-cover" fill />
            </div>
            <div className="text-neutral-700 mx-auto space-y-6 p-6">
                <h2 className="font-semibold text-xl">Upgarde to Taskify Pro Today!</h2>
                <p className="text-xs font-semibold text-neutral-600">Explore the best of Taskify</p>
                <div className="pl-3">
                    <ul className="text-sm list-disc">
                        <li>Unlimited Boards</li>
                        <li>Advanced Checklists</li>
                        <li>Admin & Security Features</li>
                        <li>And More...</li>
                    </ul>
                </div>
                <Button disabled={isLoading} onClick={onClick} className="w-full text-xl" variant="primary">
                    Upgrade
                </Button>
            </div>
            </DialogContent>
        </Dialog>
    )
}