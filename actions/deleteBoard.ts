"use server"

import db from "@/db/db"
import { createAuditLog } from "@/lib/create-audit-log"
import { decrementAvailableCount } from "@/lib/org-limit"
import { checkSubscription } from "@/lib/subscription"
import { deleteBoardSchema } from "@/schema/board"
import { createSafeAction } from "@/types/create-safe-action"
import { InputType, ReturnType } from "@/types/deleteBoard"

import { auth } from "@clerk/nextjs/server"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const handler = async (data: InputType):Promise<ReturnType> => {
    const { userId, orgId } = await auth()
    if(!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const isPro = await checkSubscription()

    const { id } = data
    let board 
    console.log("Deleted board:", id)
    try {
        board = await db.board.delete({
            where: {
                id,
                orgId
            },
        })

        if(!isPro) {
            await decrementAvailableCount()
        }
       

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE,
        });
        
    } catch (error) {
        return {
            error: "Failed to delete board"
        }
    }

    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(deleteBoardSchema, handler)