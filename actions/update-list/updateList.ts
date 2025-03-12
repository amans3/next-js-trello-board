"use server"

import db from "@/db/db"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { updateListSchema } from "./schema"
import { InputType, ReturnType } from "./types"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth()

    if(!userId || !orgId) {
        return {
            error: "Unauthenticated"
        }
    }

    const { title, boardId, id } = data 

    if(!title) {
        return {
            error: "Missing Fields. Failed to update list"
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


        list = await db.list.update({
           where: {
                id,
                boardId: boardId,
                board: {
                    orgId
                }
           },
            data: {
            title,
           }
        })

         await createAuditLog({
                    entityId: list.id,
                    entityTitle: list.title,
                    entityType: ENTITY_TYPE.LIST,
                    action: ACTION.UPDATE,
                });
    } catch (error) {
        return {
            error: "Failed to update list"
        }
    }

    revalidatePath(`/board/${boardId}`)
        return { data: list }
}

export const updateList = createSafeAction(updateListSchema, handler)
