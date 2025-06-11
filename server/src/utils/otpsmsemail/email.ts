
import nodemailer from "nodemailer";

console.log( process.env.MAILUSER);
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASS,
  },
});

const adminEmail = process.env.ADMIN_EMAILS

export async function sendOtpNotification(email:string, otp:string) {
    console.log("📧 Sending otp to notification for:", email);
  try {

    const info = await transporter.sendMail({
      from: process.env.MAILUSER,
      to: email,
      subject: "otp for interviewPlat access",
      text: `Hello user,\n\nyour otp for the access of interviewplat is.\n\nOTP: $${otp}`});

    console.log("Notification email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending sign-in notification:", err);
  }
}

export async function sentWelcomeNotification(email:string, name:string) {
  console.log("this is the user",email);
if (!adminEmail) {
  console.error("No admin emails configured");
  return;
}

try {

  const info = await transporter.sendMail({
    from: process.env.MAILUSER,
    to: email,
    subject: `Welcome ${name}`,
    text: `Welcome to interviewPlat, try to take interview and schedule iterview , you can get the feedback to improve your interview session`});

  console.log("Notification email sent:", info.messageId);
} catch (err:any) {
  console.error("Error sending sign-in notification:", err);
}
}