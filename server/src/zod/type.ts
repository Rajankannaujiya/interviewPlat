import { z } from "zod";
import { OtpSchema } from "./schema";

export type TypeOtpSchema = z.infer<typeof OtpSchema>