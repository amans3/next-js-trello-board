"use server";

import db from "@/db/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { updateBoardSchema } from "@/schema/board";
import { createSafeAction } from "@/types/create-safe-action";
import { InputType, ReturnType } from "@/types/updateBoard";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, id } = data;
  let board;
  console.log("Updated Title:", title);
  try {
    board = await db.board.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(updateBoardSchema, handler);
