import { ActionState } from "@/types/create-safe-action";
import { z } from "zod";
import { StripeRedirect} from "./schema";

export type InputType = z.infer<typeof StripeRedirect>
export type ReturnType = ActionState<InputType, string>
