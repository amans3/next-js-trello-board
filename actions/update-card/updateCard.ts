"use server"

import db from "@/db/db"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { updateCardSchema } from "./schema"
import { InputType, ReturnType } from "./types"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { createAuditLog } from "@/lib/create-audit-log"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthenticated"
        }
    }

    const { boardId, id, ...values } = data 

   
    let card

    try  {

         const board = await db.board.findUnique({
            where: {
                id:boardId,
                orgId
            }
         })

         if(!board) {
            return {
                error: "Board not found"
            }
        }


        card = await db.card.update({
           where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
           },
            data: {
            ...values
           }
        })
         await createAuditLog({
                    entityId: card.id,
                    entityTitle: card.title,
                    entityType: ENTITY_TYPE.CARD,
                    action: ACTION.UPDATE,
                });
    } catch (error) {
        return {
            error: "Failed to update card"
        }
    }

    revalidatePath(`/board/${boardId}`)
        return { data: card }
}

export const updateCard = createSafeAction(updateCardSchema, handler)
