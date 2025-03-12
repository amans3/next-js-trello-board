"use client"

import { ListWithCards } from "@/types/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useAction } from "@/hooks/use-actions";
import { updateListOrder } from "@/actions/update-list-order/updateListOrder";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order/updateCardOrder";
import { useRouter } from "next/navigation";

interface ListContainerProps {
    data: ListWithCards[]
    boardId: string    
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}


export function ListContainer({ data, boardId }: ListContainerProps) {
    const [orderedData, setOrderedData] = useState(data)
  
    console.log(orderedData)

    const router = useRouter()
    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: (data) => {
            toast.success("List reordered")
            router.refresh()
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: (data) => {
            toast.success("Card reordered")
            
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    useEffect(() => {
        setOrderedData(data)
    }, [data])

    function onDragEnd(result: any) {
        const { destination, source, type } = result;

        if(!destination) {
            return
        }

        // if dropped in same position
        if(
            destination.droppableId === source.droppableId && destination.index === source.index
        ) {
            return
        } 


        // user moves a list
        if(type === "list") {
            const copyOrderedData = [...orderedData]
            const items = reorder(
                copyOrderedData,
                source.index,
                destination.index
            ).map((item, index) => ({ ...item, order:index }))

            console.log(items)
            setOrderedData(items)
            executeUpdateListOrder({ items, boardId })
            
        }

        //user moves a card
        if(type === "card") {
            let newOrderedData = [...orderedData]

            const sourceList = newOrderedData.find(list => list.id === source.droppableId)
            const destinationList = newOrderedData.find(list => list.id === destination.droppableId)

            if(!sourceList || !destinationList) {
                return
            }

            //check if card exist on the source list

            // if(!sourceList.cards) {
            //     sourceList.cards = []
            // }

            //check if card exist on the destination list

            // if(destination.cards) {
            //     destinationList.cards = []
            // }

            //moving the card in the same list

            if(source.droppableId === destination.droppableId) {
        
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                )

                reorderedCards.forEach((card, index) => {
                    card.order = index
                })

                console.log(reorderedCards)

                sourceList.cards = reorderedCards

                setOrderedData(newOrderedData)
                // Trigger server action
                executeUpdateCardOrder({ items:sourceList.cards, boardId })
                 
                 
            } else {
                //user moves the card to another list 
                const [movedCard] = sourceList.cards.splice(source.index, 1)

                movedCard.listId = destination.droppableId

                // add card to the destination list 
                destinationList.cards.splice(destination.index, 0, movedCard)
                
                sourceList.cards.forEach((card, index) => {
                    card.order = index
                })

                //update the order for each card in the destination list
                destinationList.cards.forEach((card, index) => {
                    card.order = index
                })

                setOrderedData(newOrderedData)
                //trigger server action
                executeUpdateCardOrder({ items:sourceList.cards, boardId })
                executeUpdateCardOrder({ items:destinationList.cards, boardId })
            }
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                    {...provided.droppableProps}
                    ref={provided.innerRef} 
                    className="flex gap-x-3 h-full">
                    {orderedData.map((list, index) => (
                        <ListItem
                        key={list.id}
                        index={index}
                        data={list}
                        />
                    ))}
                    {provided.placeholder}
                    <ListForm />
                    <div className="flex-shrink-0 w-1" />
                </ol>
                )}
        </Droppable>
        </DragDropContext>
    )
}