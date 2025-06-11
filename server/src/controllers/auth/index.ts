import { Response, Request } from "express";
import bcrypt from "bcrypt"
import { prisma } from '../../db/db.index'
import jwt from "jsonwebtoken";



const saltRounds =10;
export const signup = async(req:Request,res:Response)=>{
}

export const login = async(req:Request,res:Response)=>{
}


async function generateOTP() {
 return Math.floor(100000 + Math.random() * 900000).toString();
}

const sedOtpToEmail = async()=>{
  
}