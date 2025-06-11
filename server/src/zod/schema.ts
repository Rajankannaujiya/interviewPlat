import {string, z} from "zod"

export const OtpSchema = z.object({
    to:z.string(),
    otp:z.string()
})