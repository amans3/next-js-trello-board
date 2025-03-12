import db from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";
import { BoardNavBar } from "./_components/board-navbar";

export async function generateMetaData({
    params
}: { params: Promise<{ boardId: string }>}) {
    const { orgId } = await auth()
    const { boardId } = await params

    if(!orgId) {
        return {
            title: "Board"
        }
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId
        }
    })

     return {
        title: board?.title || "Board"
     }
}


export default async function BoardIdLayout({ children, params }: { children: ReactNode, params: Promise<{ boardId: string }> }) {

    const { orgId } = await auth()
    const { boardId } = await params

    if(!orgId) {
        redirect("/select-org")
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId
        }
    })

    if(!board) {
        return notFound()
    }

    return (
        <div className="absolute inset-0 min-h-screen bg-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${board.imageFullUrl})`}}
        >
        <BoardNavBar data={board} />
        <div className="absolute inset-0 bg-black/10"></div>
        <main className="relative pt-28 h-full">{children}</main>
        </div>
    );
}
