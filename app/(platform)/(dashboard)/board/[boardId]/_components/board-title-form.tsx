"use client"
import { ElementRef, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Board } from "@prisma/client"
import { FormInput } from "@/components/form/form-input"
import { updateBoard } from "@/actions/updateBoard"
import { useAction } from "@/hooks/use-actions" 

interface BoardTitleFormProps {
    data: Board
}

export function BoardTitleForm({data}:BoardTitleFormProps) {

    const { execute } = useAction(updateBoard, {
        onSuccess: (data) => {
            console.log(data)
            setTitle(data.title)
            disableEditing()
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(data.title)

    function disableEditing() {
        setIsEditing(false)
    }

    function enableEditing() {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select()
        })
    }

    function onSubmit(formData: FormData) {
        const title = formData.get("title") as string
        console.log("I am submitted", title)
        execute({ 
            id: data.id,
            title,  
        })
    }

    function onBlur() {
        formRef.current?.requestSubmit()
    }

    if(isEditing) {
        return (
            <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
                <FormInput
                    ref={inputRef}
                    id="title"
                    onBlur={onBlur}
                    defaultValue={title}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focu-visible:outline-none font-visible:ring-transparent border-none"
                />
            </form>
        )
    }

    return (
        <Button onClick={enableEditing} variant="transparent" className="font-bold text-lg h-auto w-auto p-1 px-2">
            {title}
        </Button>
    )
}