"use server";

import db from "@/db/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { boardSchema } from "@/schema/board";
import { InputType, ReturnType } from "@/types/board";
import { createSafeAction } from "@/types/create-safe-action";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthenticated",
    };
  }

  const canCreateBoard = await hasAvailableCount()
  const isPro = await checkSubscription()

  if(!canCreateBoard && !isPro) {
    return {
        error: "You have reached your limit of free boards. Please upgrade to create more."
    }
  }

  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");

  console.log({
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUserName,
  });

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: "Missing Fields. Failed to create board",
    };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
      },
    });

    if(!isPro) {
      await incrementAvailableCount()
    }
    
    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to create board",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  return { data: board };
};

export const createBoard = createSafeAction(boardSchema, handler);
