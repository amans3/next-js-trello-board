import { z } from "zod";

export const boardSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error:"Title is required"
    }).min(1, {
        message: "Required"
    }),
    image: z.string({
        required_error: "Image is required",
        invalid_type_error: "Image is required"
    })
})


export const updateBoardSchema = z.object({
    id: z.string(),
    title: z.string({
        required_error: "Title is required",
        invalid_type_error:"Title is required"
    }).min(1, {
        message: "Required"
    }),
})

export const deleteBoardSchema = z.object({
    id: z.string(),
})