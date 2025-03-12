"use client"

import { updateCard } from "@/actions/update-card/updateCard"
import { FormInput } from "@/components/form/form-input"
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "@/hooks/use-actions"
import { CardWithList } from "@/types/types"
import { useQueryClient } from "@tanstack/react-query"
import { Layout } from "lucide-react"
import { useParams } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface HeaderProps {
    data: CardWithList 
}

export function Header({ data }: HeaderProps) {
    const queryClient = useQueryClient()
    const params = useParams()
    const [title, setTitle] = useState(data.title)
    const inputRef = useRef<ElementRef<"input">>(null)

    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            })
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id]
            })
            toast.success(`Renamed to "${data.title}"`)
            setTitle(data.title)
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    function onBlur() {
        inputRef.current?.form?.requestSubmit()

    }

    function onSubmit(formData: FormData) {
        const title = formData.get("title") as string 
        const boardId = params.boardId as string 

        if(title === data.title) return

        execute({
            title,
            boardId,
            id: data.id
        })
    }


    useEffect(() => {
        onBlur()
    }, [])

    return (
        <div className="flex items-start gap-x-3 mb-5 w-full">
            <Layout className="h-5 w-5 mt-1 text-neutral-700" />
            <div className="w-full">
                <form action={onSubmit}>
                    <FormInput
                        id="title"
                        ref={inputRef}
                        onBlur={onBlur}
                        defaultValue={title}
                        className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
                        errors={fieldErrors} 
                    />
                </form>
                <p className="text-sm text-muted-foreground mt-0.1">
                    in list 
                     <span className="font-semibold underline ml-1">
                       {data.list.title}
                    </span>
                </p>
            </div>
        </div>
    )
}

Header.Skeleton = function HeaderSkeleton() {
    return (
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
            <div>
            <Skeleton className="h-6 w-24 mb-1 bg-neutral-200" />    
            <Skeleton className="h-4 w-12 bg-neutral-200" />    
            </div>
        </div>
    )
}