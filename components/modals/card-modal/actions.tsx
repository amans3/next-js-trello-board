"use client"

import { copyCard } from "@/actions/copy-card/copyCard"
import { deleteCard } from "@/actions/delete-card/deleteCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "@/hooks/use-actions"
import { useCardModal } from "@/hooks/use-card-modal"
import { CardWithList } from "@/types/types"
import { Copy, Trash } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface ActionsProps {
    data: CardWithList
}

export function Actions({data}: ActionsProps) {

    const params = useParams()
    const cardModal = useCardModal()

    const { execute: executeCopyCard, isLoading: isLoadingCopy } =  useAction(copyCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title} copied!"`)
            cardModal.onClose()


        },
        onError: (error) => {
            toast.error(error)
        }
    })

    function handleCopy() {
        const boardId = params.boardId as string
        executeCopyCard({
            id: data.id,
            boardId: boardId
        })
    }

    const { execute: executeDeleteCard, isLoading: isLoadingDelete } =  useAction(deleteCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title} deleted"`)
            cardModal.onClose()

        },
        onError: (error) => {
            toast.error(error)
        }
    })

    function handleDelete() {
        const boardId = params.boardId as string
        executeDeleteCard({
            id: data.id,
            boardId: boardId
        })
    }


    return (
        <div className="space-y-2 mt-2">
            <p className="text-sm font-semibold">
                Actions
            </p>
            <Button
                variant="gray"
                className="w-full items-center justify-start"
                size="inline"
                disabled={isLoadingCopy}
                onClick={handleCopy}
            >
                <Copy className="h-4 w-4 mr-2" />
                <span>Copy</span>
            </Button>
            <Button
                variant="destructive"
                className="w-full items-center justify-start"
                size="inline"
                disabled={isLoadingDelete}
                onClick={handleDelete}
            >
                <Trash className="h-4 w-4 mr-2" />
                <span>Delete</span>
            </Button>
        </div>
    )
}

Actions.Skeleton = function ActionSkeleton() {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 g-neutral-200" />
            <Skeleton className="w-full h-8 g-neutral-200" />
            <Skeleton className="w-full h-8 g-neutral-200" />
        </div>
    )
}