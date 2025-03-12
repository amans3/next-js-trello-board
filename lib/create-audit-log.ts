import db from "@/db/db"
import { auth, currentUser } from "@clerk/nextjs/server"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

interface Props {
    entityId: string 
    entityType: ENTITY_TYPE
    entityTitle: string 
    action: ACTION
}

export async function createAuditLog(props:Props) {
    try {
        const { orgId } = await auth()
        const user = await currentUser()

        if(!orgId || !user) {
            throw new Error("User not found")
        }
        
        const { entityId, entityType, entityTitle, action } = props

        const al = await db.auditLog.create({
            data: {
                orgId,
                entityId,
                entityType,
                entityTitle,
                action,
                userId: user?.id,
                userImage: user?.imageUrl,
                userName: user?.firstName + " " + user?.lastName
            }
        });

        console.log(al)

    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error)
    }
}