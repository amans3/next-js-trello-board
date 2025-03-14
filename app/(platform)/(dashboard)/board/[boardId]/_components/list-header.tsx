"use client";

import { updateList } from "@/actions/update-list/updateList";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-actions";
import { List } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { toast } from "sonner";
import { ListOptions } from "./list-options";
interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export function ListHeader({ data, onAddCard }: ListHeaderProps) {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }

  function disabledEditing() {
    setIsEditing(false);
  }

  const { execute, fieldErrors } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`List renamed to ${data.title}`);
      setTitle(data.title);
      disabledEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) {
      return disabledEditing();
    }

    execute({
      title,
      id,
      boardId,
    });
  }

  function onBlur() {
    formRef.current?.requestSubmit();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  }

  useEventListener("keydown", onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form action={handleSubmit} ref={formRef} className="flex-1 px-[2px]">
          <input hidden id="id" name="id" value={data.id} onChange={() => {}} />
          <input
            hidden
            id="boardId"
            name="boardId"
            value={data.boardId}
            onChange={() => {}}
          />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            placeholder="Enter list title.."
            defaultValue={title}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
            errors={fieldErrors}
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <ListOptions data={data} onAddCard={onAddCard} />
    </div>
  );
}
