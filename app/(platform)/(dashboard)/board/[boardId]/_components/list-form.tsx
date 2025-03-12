"use client"

import { Plus, X } from "lucide-react"
import { ListWrapper } from "./list-wrapper"
import { ElementRef, useRef, useState } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { FormInput } from "@/components/form/form-input"
import { useParams, useRouter } from "next/navigation"
import { FormSubmit } from "@/components/form/form-submit-button"
import { Button } from "@/components/ui/button"
import { createList } from "@/actions/create-list/list"
import { useAction } from "@/hooks/use-actions"
import { toast } from "sonner"

export function ListForm() {
    
    const router = useRouter()
    const params = useParams()
    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)
    const [isEditing, setIsEditing] = useState(false)

    function enableEditing() {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
        })
    }

    function disabledEditing() {
        setIsEditing(false)
    }

    const { execute, fieldErrors } = useAction(createList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" created`)
            disabledEditing()
            router.refresh()
        },
        onError: (error) => {
            toast.error(error)
        }

    })
 
    function onKeyDown(e:KeyboardEvent) {
        if(e.key === "Escape") {
            disabledEditing()
        }
    }

    useEventListener("keydown", onKeyDown)
    useOnClickOutside(formRef as any, disabledEditing)

    function onSubmit(formData: FormData) {
        const title = formData.get("title") as string
        const boardId = formData.get("boardId") as string

        execute({
            title,
            boardId
        })
    }

    if(isEditing) {
        return (
            <ListWrapper>
                <form
                    ref={formRef}
                    className="w-full p-3 rounded-md bg-white space-y-4 shadow-md" 
                    action={onSubmit}
                >
                    <FormInput 
                        ref={inputRef}
                        id="title"
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                        placeholder="Enter list title..."
                        errors={fieldErrors}
                    />
                    <input 
                        hidden 
                        onChange={() => {}} 
                        value={params.boardId} 
                        name="boardId" />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>
                            Add List
                        </FormSubmit>
                        <Button size="sm" variant="ghost" onClick={disabledEditing}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        )
    }

    return (
      <ListWrapper>
            <button className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center"
            onClick={enableEditing}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add a list
            </button>
      </ListWrapper>
    )
}