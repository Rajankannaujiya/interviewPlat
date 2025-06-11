import { Response, Request } from "express";
import bcrypt from "bcrypt"
import { prisma } from '../../db/db.index'
import jwt from "jsonwebtoken";
import redisClient from "../../utils/redis/redis-otp";
import { sendOtpNotification } from "../../utils/otpsmsemail/email";
import { error } from "console";





// model User {
// id String @id @default(cuid())
// username String
// email String? @unique
// mobileNumber String? @unique
// isEmailVerified Boolean @default(false)
// isMobileVerified Boolean @default(false)
// password String?
// profileUrl String?   
// role Role @default(CANDIDATE)
// createdAt DateTime @default(now())
// updatedAt DateTime @updatedAt
// interviewsAsInterviewer Interview[] @relation("UserAsInterviewer")
// interviewsAsCandidate Interview[] @relation("UserAsCandidate")
// comments Comment[]
// }
const saltRounds =10;
export const sendOtpToEmail = async(req:Request,res:Response)=> {
    const {username, email, role} = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    let user = await prisma.user.findUnique({ where: { email } });
    if(user) return res.status(400).json({error:"user already exist"});
try {
    
        user = await prisma.user.create({
          data: {
            email,
            username: email.split('@')[0],
            role: role,
          }
        });
    
        const otp:string = await generateOTP();
        const key = `otp:${email}`
        const ttl = 300;
    
        await redisClient.setEx(key,ttl, otp);
    
        await sendOtpNotification(email, otp)
    
} catch (error) {
     return res.status(500).json({ error: 'Failed to send OTP' });
}

}


export const verifyemailotp =async(req:Request,res:Response)=>{
    const {email, submittedOtp} =req.body;
    const key =`otp:${email}`;

   try {
     const storedOtp = await redisClient.get(key);
 
     if (!storedOtp) return res.status(400).json({ error: 'No OTP sent or Otp expired' });
      if (storedOtp !== submittedOtp) return res.status(400).json({ error: 'Invalid OTP' });
 
      await redisClient.del( key)
     await prisma.user.update({
     where: { email },
     data: { isEmailVerified: true }
   });

   return res.status(200).json({ message: 'Otp verified successfully' });
   } catch (error) {
        return res.status(500).json({ error: 'Failed to verify OTP' });
   }


}
export const login = async(req:Request,res:Response)=>{
}


async function generateOTP() {
 return Math.floor(100000 + Math.random() * 900000).toString();
}
