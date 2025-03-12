import { ActionState } from "@/types/create-safe-action";
import { List } from "@prisma/client";
import { z } from "zod";
import { deleteListSchema } from "./schema";

export type InputType = z.infer<typeof deleteListSchema>
export type ReturnType = ActionState<InputType, List>
