"use server"

import db from "@/db/db"
import { createSafeAction } from "@/types/create-safe-action"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { deleteListSchema } from "./schema"
import { InputType, ReturnType } from "./types"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data: InputType):Promise<ReturnType> => {
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


        list = await db.list.delete({
           where: {
                id,
                boardId: boardId,
                board: {
                    orgId
                }
           }
        })

         await createAuditLog({
                    entityId: list.id,
                    entityTitle: list.title,
                    entityType: ENTITY_TYPE.LIST,
                    action: ACTION.DELETE,
                });
    } catch (error) {
        return {
            error: "Failed to delete list"
        }
    }

    revalidatePath(`/board/${boardId}`)
        return { data: list }
}

export const deleteList = createSafeAction(deleteListSchema, handler)
