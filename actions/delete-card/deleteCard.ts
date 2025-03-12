"use server"

import db from "@/db/db"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { InputType, ReturnType } from "./types"
import { deleteCardSchema } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data:InputType):Promise<ReturnType> => {
    const { userId, orgId } = await auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthenticated"
        }
    }

    const { id, boardId } = data 

    if(!id) {
        return {
            error: "Missing Fields. Failed to delete card"
        }
    }

    let card 

    try  {

        card = await db.card.delete({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            }
        })

         await createAuditLog({
                    entityId: card.id,
                    entityTitle: card.title,
                    entityType: ENTITY_TYPE.CARD,
                    action: ACTION.DELETE,
                });

    } catch (error) {
        return {
            error: "Failed to delete card"
        }
    }

    revalidatePath(`/board/${boardId}`)
        return { data: card }
}

export const deleteCard = createSafeAction(deleteCardSchema, handler)
