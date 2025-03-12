import db from "@/db/db"
import { auth } from "@clerk/nextjs/server"
import { redirect, useRouter } from "next/navigation"
import { ListContainer } from "./_components/list-container"

export default async function BoardIdPage({
    params
}: { params: Promise<{ boardId: string }>}) {
   
    const { orgId } = await auth()
    const { boardId } = await params

    if(!orgId) {
        redirect("/select-org")
    }

    const lists = await db.list.findMany({
        where: {
            boardId: boardId,
            board : {
                orgId,
            }
        },
        include: {
            cards: {
                orderBy: {
                    order: "asc"
                }
            }
        },
        orderBy: {
            order: "asc"
        }
    })

    console.log("lists", lists)

    return (
        <div className="p-4 h-full overflow-x-auto">
        <ListContainer
            boardId={boardId}
            data={lists}        
        />
        
        </div>
    )
}