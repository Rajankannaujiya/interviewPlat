import { Response, Request } from "express";
import { prisma } from '../../db/db.index'

export const getInterview = async(req:Request ,res:Response)=>{
    res.json({signup: "hello from interview"})
}