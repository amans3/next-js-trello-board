"use server"

import db from "@/db/db"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { InputType, ReturnType } from "./types"
import { copyCardSchema } from "./schema"
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
            error: "Missing Fields. Failed to copy card"
        }
    }

    let card 

    try  {

        const cardToCopy = await db.card.findUnique({
            where: {
                id,
                list : {
                    board: {
                        orgId
                    }
                }
            }
        })

        if(!cardToCopy) {
            return {
                error: "Card not found"
            }
        }   

        const lastCard = await db.card.findFirst({
            select: { order: true },
            where: { listId: cardToCopy.listId },
            orderBy: { order: "desc" }
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1

        card = await db.card.create({
            data: {
                title: `${cardToCopy.title} - Copy`,
                description: cardToCopy.description,
                order: newOrder,
                listId: cardToCopy.listId
            }
        })

        await createAuditLog({
            entityTitle: card.title,
            entityId: card.id,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE
        })

    } catch (error) {
        return {
            error: "Failed to copy card"
        }
    }

    revalidatePath(`/board/${boardId}`)
        return { data: card }
}

export const copyCard = createSafeAction(copyCardSchema, handler)
