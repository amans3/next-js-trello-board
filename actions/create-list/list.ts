"use server"

import db from "@/db/db"
import { boardSchema } from "@/schema/board"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { InputType, ReturnType } from "./types"
import { createListSchema } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthenticated"
        }
    }

    const { title, boardId } = data 

    if(!title) {
        return {
            error: "Missing Fields. Failed to create list"
        }
    }

    let list 

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

        const lastList = await db.list.findFirst({
            select: { order: true },
            where: { boardId: boardId },
            orderBy: { order: "desc" }
        })

        const newOrder = lastList ? lastList.order + 1 : 1;

        list = await db.list.create({
           data: {
            title,
            boardId,
            order: newOrder
           }
        })

        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE,
        });


    } catch (error) {
        return {
            error: "Failed to create list"
        }
    }

    revalidatePath(`/board/${boardId}`)
        return { data: list }
}

export const createList = createSafeAction(createListSchema, handler)
