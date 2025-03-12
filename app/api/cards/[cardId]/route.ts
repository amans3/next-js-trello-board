import db from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request,
    { params }: { params: Promise<{ cardId: string }> }
) {
    
    try  {
        const { userId, orgId } = await auth()
        const { cardId } = await params
    
        if(!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const card = await db.card.findUnique({
            where: {
                id: cardId,
                list : {
                    board : {
                        orgId
                    }
                }
            },
            include: {
                list: {
                    select: {
                        title: true
                    }
                }
            }
        })

        return NextResponse.json(card)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 }) 
    }

   

}