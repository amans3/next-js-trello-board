import { ActionState } from "@/types/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";
import { updateCardOrderSchema } from "./schema";

export type InputType = z.infer<typeof updateCardOrderSchema>
export type ReturnType = ActionState<InputType, Card[]>
