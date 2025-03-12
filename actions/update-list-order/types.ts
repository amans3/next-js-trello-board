import { z } from "zod";
import { updateListOrderSchema } from "./schema";
import { ActionState } from "@/types/create-safe-action";
import { List } from "@prisma/client";

export type InputType = z.infer<typeof updateListOrderSchema>
export type ReturnType = ActionState<InputType, List[]>
