import { z } from "zod";

export const updateCardSchema = z.object({
    title: z.optional(z.string({
        required_error: "Title is required",
        invalid_type_error:"Title is required"
    }).min(1, {
        message: "Required"
    })),
    description: z.optional(
        z.string({
            required_error: "Description is required",
            invalid_type_error: "Description is required"
        })
    ),
    id: z.string(),
    boardId: z.string()
})
