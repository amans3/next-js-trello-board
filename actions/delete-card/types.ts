import { ActionState } from "@/types/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";
import { deleteCardSchema } from "./schema";

export type InputType = z.infer<typeof deleteCardSchema>
export type ReturnType = ActionState<InputType, Card>
