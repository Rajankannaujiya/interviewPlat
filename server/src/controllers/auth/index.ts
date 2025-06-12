import { Response, Request } from "express";
import bcrypt from "bcrypt"
import { prisma } from '../../db/db.index'
import redisClient from "../../utils/redis/redis-otp";
import { sendOtpNotification, sendSms } from "./config";
import { generateOTP } from "./config";



export const sendSignUpOtpToEmail = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body)
  const { username, email, role } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' })
    return
  };
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      res.status(400).json({ error: "user already exist" });
      return
    };
    user = await prisma.user.create({
      data: {
        email,
        username: username,
        role: role,
      }
    });

    const otp: string = await generateOTP();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    const key = `otp:${email}`
    const ttl = 300;
    await redisClient.connect();

    await redisClient.setEx(key, ttl, hashedOtp);
    await redisClient.disconnect();
    if(!await sendOtpNotification(email, otp)) {
      res.status(401).json({error: "Unable to send email"})
      return
    }
    res.status(200).json({ message: 'Otp sent successfully' });
    return;

  } catch (error:any) {
    console.log("error", error.message)
    res.status(500).json({ error: 'Failed to send OTP' });
    return;
  }

}


export const verifyemailotp = async (req: Request, res: Response): Promise<void> => {
  const { email, submittedOtp } = req.body;
  const key = `otp:${email}`;

  try {
    await redisClient.connect()
    const storedHashOtp = await redisClient.get(key);

    if (!storedHashOtp) {
      res.status(400).json({ error: 'No OTP sent or Otp expired' })
      return;
    };
    const isMatch = await bcrypt.compare(submittedOtp, storedHashOtp);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    await redisClient.del(key)
    await redisClient.disconnect()
    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true }
    });

    res.status(200).json({ message: 'Otp verified successfully' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify OTP' });
    return;
  }


}


export const sendLoginotpEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  };
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: "user is not registered" })
      return;
    };

    const otp: string = await generateOTP();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

      await redisClient.connect()
    const key = `otp:${email}`
    const ttl = 300;


    await redisClient.setEx(key, ttl, hashedOtp);
    await redisClient.disconnect()
    
    if(!await sendOtpNotification(email, otp)) {
      res.status(401).json({error: "Unable to send email"})
      return
    }
    res.status(200).json({ message: 'Otp sent successfully' });
    return

  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
    return
  }
}


export const sendSignUpOtpToMobile = async (req: Request, res: Response): Promise<void> => {
  const { username, mobileNumber, role } = req.body;
  if (!mobileNumber) {
    res.status(400).json({ error: 'mobileNumber is required' })

    return;
  }

  const isValid = /^\+?[0-9]{10,15}$/.test(mobileNumber);
  if (!isValid) {
    res.status(400).json({ error: 'Invalid mobile number format' });
    return;
  }

  try {
    let user = await prisma.user.findUnique({ where: { mobileNumber } });
    if (user) {
      res.status(400).json({ error: 'user is already registered' })

      return;
    };
    user = await prisma.user.create({
      data: {
        mobileNumber,
        username: username,
        role: role,
      }
    });

    const otp: string = await generateOTP();

    await redisClient.connect();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);


    const key = `otp:${mobileNumber}`
    const ttl = 300;

    await redisClient.setEx(key, ttl, hashedOtp);
    await redisClient.disconnect();

    if(!await sendSms(mobileNumber, otp)) {
      res.status(401).json({error: "Unable to send email"})
      return
    }

    res.status(200).json({ message: 'Otp sent successfully' });
    return;

  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
    return;
  }
}


export const verifymobileotp = async (req: Request, res: Response): Promise<void> => {
  const { mobileNumber, submittedOtp } = req.body;
  const key = `otp:${mobileNumber}`;

  try {
    await redisClient.connect();
    const storedHashOtp = await redisClient.get(key);

    if (!storedHashOtp) {
      res.status(400).json({ error: 'No OTP sent or Otp expired' })
      return;
    };
    const isMatch = await bcrypt.compare(submittedOtp, storedHashOtp);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }
    await redisClient.del(key)
    await redisClient.disconnect();
    await prisma.user.update({
      where: { mobileNumber },
      data: { isMobileVerified: true }
    });

    res.status(200).json({ message: 'Otp verified successfully' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify OTP' });
    return;
  }
}


export const sendLoginotpMobile = async (req: Request, res: Response): Promise<void> => {
  const { mobileNumber } = req.body;
  if (!mobileNumber) {
    res.status(400).json({ error: 'Email is required' });
    return;
  };

  try {
    let user = await prisma.user.findUnique({ where: { mobileNumber } });
    if (!user) {
      res.status(400).json({ error: "user is not registered" })
      return;
    };

    const otp: string = await generateOTP();

    await redisClient.connect();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);


    const key = `otp:${mobileNumber}`
    const ttl = 300;

    await redisClient.setEx(key, ttl, hashedOtp);
    await redisClient.disconnect();
    if(!await sendSms(mobileNumber, otp)) {
      res.status(401).json({error: "Unable to send email"})
      return
    }
    res.status(200).json({ message: 'Otp sent successfully' });
    return

  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
    return
  }
}


export const resendOtpEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await redisClient.connect();
    const key = `otp:${email}`;
    const cooldownKey = `otp_cooldown:${email}`;

    const onCooldown = await redisClient.get(cooldownKey);
    if (onCooldown) {
      const ttl = await redisClient.ttl(cooldownKey);
      res.status(429).json({ error: `Please wait ${ttl} seconds before requesting a new OTP` });
      return;
    }

    const otp = await generateOTP();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);
    const ttl = 300; // 5 minutes

    await redisClient.setEx(key, ttl, hashedOtp);
    await redisClient.setEx(cooldownKey, 60, '1');
    await redisClient.disconnect()

     if(!await sendOtpNotification(email, otp)) {
      res.status(401).json({error: "Unable to send email"})
      return
    }

    res.status(200).json({ message: 'OTP resent successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
}


export const resendOtpMobile = async (req: Request, res: Response): Promise<void> => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    res.status(400).json({ error: 'mobile number is required' });
    return;
  }

  const isValid = /^\+?[0-9]{10,15}$/.test(mobileNumber);
  if (!isValid) {
    res.status(400).json({ error: 'Invalid mobile number format' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { mobileNumber } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await redisClient.connect();

    const key = `otp:${mobileNumber}`;
    const cooldownKey = `otp_cooldown:${mobileNumber}`;

    const onCooldown = await redisClient.get(cooldownKey);
    if (onCooldown) {
      const ttl = await redisClient.ttl(cooldownKey);
      res.status(429).json({ error: `Please wait ${ttl} seconds before requesting a new OTP` });
      return;
    }

    const otp = await generateOTP();
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);
    const ttl = 300; // 5 minutes

    await redisClient.setEx(key, ttl, hashedOtp);
    await redisClient.setEx(cooldownKey, 60, '1');
    await redisClient.disconnect();
    if(!await sendSms(mobileNumber, otp)) {
      res.status(401).json({error: "Unable to send email"})
      return
    }

    res.status(200).json({ message: 'OTP resent successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
}