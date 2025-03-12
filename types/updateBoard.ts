import { updateBoardSchema } from "@/schema/board";
import { z } from "zod";
import { ActionState } from "./create-safe-action";
import { Board } from "@prisma/client";

export type InputType = z.infer<typeof updateBoardSchema>
export type ReturnType = ActionState<InputType, Board>

