"use server"

import db from "@/db/db"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { InputType, ReturnType } from "./types"
import { createCardSchema } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthenticated"
        }
    }

    const { title, boardId, listId } = data 

    if(!title) {
        return {
            error: "Missing Fields. Failed to create card"
        }
    }

    let card 

    try  {

        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    id:boardId,
                    orgId
                }
            }
        })

        if(!list) {
            return {
                error: "List not found"
            }
        }

        const lastCard = await db.card.findFirst({
            select: { order: true },
            where: { listId },
            orderBy: { order: "desc" }
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1
         
        card = await db.card.create({
            data: {
                title,
                listId,
                order: newOrder
            }
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
        });

    } catch (error) {
        console.log(error)
        return {
            error: "Failed to create card"
        }
    }

    revalidatePath(`/board/${boardId}`)
        return { data: card }
}

export const createCard = createSafeAction(createCardSchema, handler)
