"use client"

import { stripeRedirect } from "@/actions/stripe-redirect/stripeRedirect"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-actions"
import { useProModal } from "@/hooks/use-pro-modal"
import { toast } from "sonner"

type SubscriptionButtonProps = {
    isPro: boolean
}
export function SubscriptionButton({ isPro }: SubscriptionButtonProps) {

    const proModal = useProModal()
  
    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    function onClick() {
        if(isPro) {
            execute({})
        } else {
            proModal.onOpen()
        }
    }

 return <Button onClick={onClick} disabled={isLoading} variant="primary">
    {isPro ? "Manage Subscriptions" : "Upgrade to pro"}
 </Button>
}