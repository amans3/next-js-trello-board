import { boardSchema, updateBoardSchema } from "@/schema/board";
import { Board } from "@prisma/client";
import { ActionState } from "./create-safe-action";
import { z } from "zod";

export type InputType = z.infer<typeof boardSchema>
export type ReturnType = ActionState<InputType, Board>


// export enum ACTION {
//   CREATE = "CREATE",
//   UPDATE = "UPDATE",
//   DELETE = "DELETE"
// }

// export enum ENTITY_TYPE {
//   BOARD = "BOARD",
//   LIST = "LIST",
//   CARD = "CARD"
// }