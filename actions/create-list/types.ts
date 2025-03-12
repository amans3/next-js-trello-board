import { z } from "zod";
import { createListSchema } from "./schema";
import { ActionState } from "@/types/create-safe-action";
import { Board, List } from "@prisma/client";

export type InputType = z.infer<typeof createListSchema>
export type ReturnType = ActionState<InputType, List>
