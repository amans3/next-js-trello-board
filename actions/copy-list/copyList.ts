"use server"

import db from "@/db/db"
import { createAuditLog } from "@/lib/create-audit-log"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { copyListSchema } from "./schema"
import { InputType, ReturnType } from "./types"

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
            error: "Missing Fields. Failed to delete list"
        }
    }

    let listToCopy, list 

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


        listToCopy = await db.list.findUnique({
           where: {
                id,
                boardId: boardId,
                board: {
                    orgId
                }
           },
           include: {
            cards: true
           }
        })

        if(!listToCopy) {
            return {
                error: "List not found"
            }
        }

        const lastList = await db.list.findFirst({
            select: { order: true },
            where: { boardId },
            orderBy: { order: "desc" }
        })

        const newOrder = lastList ? lastList.order + 1 : 1

        list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                order: newOrder,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map((card, index) => ({
                            title: card.title,
                            description: card.description,
                            order: card.order
                        }))
                    }
                },
            },
            include:{
                cards: true
            }
        })

         await createAuditLog({
                    entityTitle: list.title,
                    entityId: list.id,
                    entityType: ENTITY_TYPE.LIST,
                    action: ACTION.CREATE
                })

    } catch (error) {
        return {
            error: "Failed to copy list"
        }
    }

    revalidatePath(`/board/${boardId}`)
        return { data: list }
}

export const copyList = createSafeAction(copyListSchema, handler)
