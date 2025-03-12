import { z } from "zod";

export const createCardSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error:"Title is required"
    }).min(1, {
        message: "Required"
    }),
    boardId: z.string(),
    listId: z.string()
})
