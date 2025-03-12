import { ActionState } from "@/types/create-safe-action";
import { Card } from "@prisma/client";
import { z } from "zod";
import { copyCardSchema } from "./schema";

export type InputType = z.infer<typeof copyCardSchema>
export type ReturnType = ActionState<InputType, Card>
