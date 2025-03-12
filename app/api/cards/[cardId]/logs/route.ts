import db from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    {params}: {params: Promise<{ cardId: string }>}
) {
    try {
        const { userId, orgId } =  await auth()
        const { cardId } = await params
        if(!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const auditLogs = await db.auditLog.findMany({
            where: {
                orgId,
                entityId: cardId,
                entityType: ENTITY_TYPE.CARD
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 3
        })

        console.log("AL", auditLogs)

        return NextResponse.json(auditLogs)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}