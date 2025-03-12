"use client"

import { FormSubmit } from "@/components/form/form-submit-button"
import { FormTextarea } from "@/components/form/form-textarea"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { ElementRef, useRef, KeyboardEventHandler, forwardRef } from "react"
import { useParams } from "next/navigation"
import { createCard } from "@/actions/create-card/card"
import { useAction } from "@/hooks/use-actions"
import { useOnClickOutside, useEventListener } from "usehooks-ts"
import { toast } from "sonner"

interface CardFormProps {
    listId: string
    boardId: string
    enableEditing: () => void
    disableEditing: () => void
    isEditing: boolean
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
    listId,
    boardId,
    enableEditing,
    disableEditing,
    isEditing
}, ref) => {

    const params = useParams()
    const formRef = useRef<ElementRef<"form">>(null)

    const { execute, fieldErrors } =  useAction(createCard, {
        onSuccess:(data) => {
            toast.success(`Card ${data.title} created`)
            formRef.current?.reset()
        },
        onError:(error) => {
            toast.error(error)
        }

    })

    function onKeyDown(e:KeyboardEvent) {
        if(e.key === "Escape") {
            disableEditing()
        }
    }

    useOnClickOutside(formRef as any, disableEditing)
    useEventListener("keydown", onKeyDown)

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = e => {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            formRef.current?.requestSubmit()
            formRef.current?.reset()
        }
       
    }

    function onSubmit(formData: FormData) {
        const title = formData.get("title") as string
        const listId = formData.get("listId") as string
        const boardId = formData.get("boardId") as string

        execute({
            title, listId, boardId
        })

        // formRef.current?.reset()
        disableEditing()
    }

    if(isEditing) {
        return (
            <form ref={formRef} action={onSubmit} className="m-1 py-0.5 px-1 space-y-4"
            >
                <FormTextarea
                    id="title"
                    onKeyDown={onTextareaKeyDown}
                    ref={ref}
                    placeholder="Enter a title for this card"
                    errors={fieldErrors}
                />
                <input 
                    hidden 
                    // id="listId" 
                    name="listId" 
                    onChange={() => {}}
                    value={listId} 
                />
                 <input 
                    hidden 
                    // id="boardId" 
                    name="boardId" 
                    onChange={() => {}}
                    value={boardId} 
                />
                <div className="flex items-center gap-x-1">
                    <FormSubmit>
                        Add Card
                    </FormSubmit>
                    <Button
                    variant="ghost" 
                    onClick={disableEditing} size="sm">
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </form>
        )
    }


    return (
       <div className="pt-2 px-2">
        <Button 
        size="sm"
        variant="ghost"
        onClick={enableEditing} 
        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add a card
        </Button>
       </div>
    )
})

CardForm.displayName = "CardForm"