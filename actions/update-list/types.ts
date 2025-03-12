import { z } from "zod";
import { updateListSchema } from "./schema";
import { ActionState } from "@/types/create-safe-action";
import { Board, List } from "@prisma/client";

export type InputType = z.infer<typeof updateListSchema>
export type ReturnType = ActionState<InputType, List>
