"use server"

import db from "@/db/db"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { updateCardOrderSchema } from "./schema"
import { InputType, ReturnType } from "./types"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthenticated"
        }
    }

    const { items, boardId } = data 

    let updatedCards 

    try  {
        const transaction = items.map((card) => db.card.update({
            where: {
                id: card.id,
                list: {
                    boardId,
                    board:{
                        orgId
                    }
                }
            },
            data: {
                order: card.order,
                listId: card.listId
            },
        })
    )

    updatedCards = await db.$transaction(transaction)

    } catch (error) {
        return {
            error: "Failed to update list order"
        }
    }


    revalidatePath(`/board/${boardId}`)
        return { data: updatedCards }
}

export const updateCardOrder = createSafeAction(updateCardOrderSchema, handler)
