"use client";

import { copyList } from "@/actions/copy-list/copyList";
import { deleteList } from "@/actions/delete-list/deleteList";
import { FormSubmit } from "@/components/form/form-submit-button";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-actions";
import { List } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface ListOptionsProps {
  onAddCard: () => void;
  data: List;
}

export function ListOptions({ data, onAddCard }: ListOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null)
  
  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" deleted`)
      closeRef.current?.click()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  function onDelete(formData: FormData) {
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    executeDelete({
      id,
      boardId
    })
  }

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied!`)
      closeRef.current?.click()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  function onCopy(formData: FormData) {
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    executeCopy({
      id,
      boardId
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List Actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          onClick={onAddCard}
        >
          Add Card
        </Button>
        <form action={onCopy}>
          <input 
          hidden 
          name="id" 
          id="id" 
          onChange={() => {}} 
          value={data.id} 
          />
          <input
            hidden
            name="boardId"
            id="boardId"
            onChange={() => {}}
            value={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy List
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input 
          hidden 
          name="id" 
          id="id" 
          onChange={() => {}} 
          value={data.id} 
          />
          <input
            hidden
            name="boardId"
            id="boardId"
            onChange={() => {}}
            value={data.boardId}
          />
          <FormSubmit
            variant="destructive"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm hover:bg-red-500"
          >
            Delete this List
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
