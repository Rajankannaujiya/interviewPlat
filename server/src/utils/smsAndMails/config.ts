
import nodemailer from "nodemailer";
import twilio from "twilio"


export async function generateOTP() {
 return Math.floor(100000 + Math.random() * 900000).toString();
}


console.log(process.env.EMAILUSER,process.env.EMAILPASS)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASS,
  },
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid,authToken);



export async function sendOtpNotification(email:string, otp:string):Promise<boolean> {
  try {

    const info = await transporter.sendMail({
      from: process.env.EMAILUSER,
      to: email,
      subject: "otp for interviewPlat access",
      text: `Hello user,\n\nyour otp for the access of interviewplat is.\n\nOTP: $${otp}`});
      
    console.log("Notification email sent:", info.messageId);
      return true
  } catch (err) {
    console.error("Error sending sign-in notification:", err);
    return false
  }
}

export async function sentWelcomeNotification(email:string, name:string):Promise<boolean> {
  console.log("this is the user",email);
try {

  const info = await transporter.sendMail({
    from: process.env.EMAILUSER,
    to: email,
    subject: `Welcome ${name}`,
    text: `Welcome to interviewPlat, try to take interview and schedule iterview , you can get the feedback to improve your interview session`});

  console.log("Notification email sent:", info.messageId);
  return true
} catch (err:any) {
  console.error("Error sending welcome notification:", err);
  return false
}
}

export const sendInteviewScheduleMail = async(email:string, username:string,interviewerName: string, scheduledTime: string): Promise<boolean> =>{

  try {
   const info = await transporter.sendMail({
      from: process.env.EMAILUSER,
      to: email,
      subject: "Interview Scheduled",
      text: `Hello ${username},\n\nyour interview with ${interviewerName} is schedulled at: $${scheduledTime}`});
      
    console.log("Notification email sent:", info.messageId);
    return true;
    
  } catch (error) {
    console.error("unable to send the schedule mail", error);
    return false;
  }
}

export const sendSms = async( mobileNumber:string, otp:string): Promise<boolean> =>{
 try {
    await client.messages.create({
      body: `Hello, your verification code for interviewPlat is: ${otp}`,
      messagingServiceSid: process.env.TWILIO_SERVICE,
      to: mobileNumber
    })
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}
