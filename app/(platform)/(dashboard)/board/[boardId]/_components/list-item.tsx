"use client";

import { ListWithCards } from "@/types/types";
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export function ListItem({ data, index }: ListItemProps) {
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  function disabledEditing() {
    setIsEditing(false);
  }

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  }

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListHeader data={data} onAddCard={enableEditing} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem key={index} index={index} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              ref={textAreaRef}
              listId={data.id}
              boardId={data.boardId}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disabledEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}
