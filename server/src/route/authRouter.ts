import { Router } from "express";
import { resendOtpEmail, resendOtpMobile, sendLoginotpEmail, sendLoginotpMobile, sendSignUpOtpToEmail, sendSignUpOtpToMobile, verifyemailotp, verifymobileotp } from "../controllers/auth";


const router = Router();

router.post("/signup/otp/email",sendSignUpOtpToEmail)
router.post("/signup/otp/mobile",sendSignUpOtpToMobile)

router.post("/login/otp/email",sendLoginotpEmail)
router.post("/login/otp/mobile",sendLoginotpMobile) 

router.post("/verify/email", verifyemailotp)
router.post("/verify/mobile", verifymobileotp)

router.post("/resend/otp/email",resendOtpEmail)
router.post("/resend/otp/mobile",resendOtpMobile) 


export default router;