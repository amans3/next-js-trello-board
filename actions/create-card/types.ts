import { z } from "zod";
import { createCardSchema} from "./schema";
import { ActionState } from "@/types/create-safe-action";
import { Board, Card, List } from "@prisma/client";

export type InputType = z.infer<typeof createCardSchema>
export type ReturnType = ActionState<InputType, Card>
