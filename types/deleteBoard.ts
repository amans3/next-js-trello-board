import { deleteBoardSchema } from "@/schema/board"
import { Board } from "@prisma/client"
import { ActionState } from "./create-safe-action"
import { z } from "zod"

export type InputType = z.infer<typeof deleteBoardSchema>
export type ReturnType = ActionState<InputType, Board>

