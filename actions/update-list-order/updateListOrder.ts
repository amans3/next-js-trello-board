"use server"

import db from "@/db/db"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { updateListOrderSchema } from "./schema"
import { InputType, ReturnType } from "./types"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthenticated"
        }
    }

    const { items, boardId } = data 

    let lists 

    try  {
        const transaction = items.map((list) => db.list.update({
                where: {
                    id: list.id,
                    board: {
                        orgId
                    }
                },
                data: {
                    order: list.order
                }
            })
        )
        lists = await db.$transaction(transaction)
    } catch (error) {
        return {
            error: "Failed to update list order"
        }
    }


    revalidatePath(`/board/${boardId}`)
        return { data: lists }
}

export const updateListOrder = createSafeAction(updateListOrderSchema, handler)
