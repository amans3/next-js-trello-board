import { ActionState } from "@/types/create-safe-action";
import { List } from "@prisma/client";
import { z } from "zod";
import { copyListSchema } from "./schema";

export type InputType = z.infer<typeof copyListSchema>
export type ReturnType = ActionState<InputType, List>
