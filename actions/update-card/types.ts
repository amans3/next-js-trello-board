import { ActionState } from "@/types/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";
import { updateCardSchema } from "./schema";

export type InputType = z.infer<typeof updateCardSchema>
export type ReturnType = ActionState<InputType, Card>
