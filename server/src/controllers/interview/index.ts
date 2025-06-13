import { Response, Request } from "express";
import { prisma } from '../../db/db.index'
import { InterViewStatus } from "@prisma/client";
import { sendInteviewScheduleMail } from "../../utils/smsAndMails/config";


export const createInterview = async (req: Request, res: Response): Promise<void> => {
    const { interviewerId, candidateId, scheduledTime } = req.body;

    try {

        const interview = await prisma.interview.create({
            data: {
                interviewerId,
                candidateId,
                scheduledTime: new Date(scheduledTime),
            }
        })

        // Get candidate and interviewer details for the email
        const [candidate, interviewer] = await Promise.all([
            prisma.user.findUnique({ where: { id: candidateId } }),
            prisma.user.findUnique({ where: { id: interviewerId } }),
        ]);

        if (!candidate || !interviewer) {
            res.status(404).json({ message: "User not found for email notification" });
            return;
        }

        candidate.email && interviewer.email && await sendInteviewScheduleMail(
            candidate?.email,
            candidate.username,
            interviewer.username,
            new Date(scheduledTime).toLocaleString()
        );

        res.status(201).json({ message: "inteview created successfully", interview: interview });
        return

    } catch (error) {
        res.status(500).json({ error: 'Failed to create interview' });
        return;
    }
}

export const getAllMyInterviews = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    try {

        const getAllMyInterviews = await prisma.interview.findMany({
            where: {
                OR: [
                    { interviewerId: userId },
                    { candidateId: userId }
                ]
            },
            include: {
                candidate: true,
                interviewr: true,
                Comment: true,
                feedback: true
            }
        })

        res.status(201).json({ message: "inteviews fetched successfully", myinterviews: getAllMyInterviews });
        return


    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch interviews' });
        return;
    }
}


export const getInterviewById = async (req: Request, res: Response): Promise<void> => {
    const { interviewId } = req.params;

    try {
        const interview = await prisma.interview.findUnique({
            where: {
                id: interviewId
            },
            include: {
                candidate: true,
                interviewr: true,
                Comment: true,
                feedback: true
            }
        })

        if (!interview) {
            res.status(404).json({ message: "Interview not found" });
            return
        }

        res.status(201).json({ message: "inteviews fetched successfully", interview: interview });
        return

    } catch (error) {
        res.status(500).json({ error: 'Failed to get interview' });
        return;
    }
}


export const updateInterviewStatus = async (req: Request, res: Response): Promise<void> => {
    const { interviewerId } = req.params;
    console.log(req.body)
    const { status } = req.body;


    if (!Object.values(InterViewStatus).includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
    }
    try {
        const updatedInterview = await prisma.interview.update({
            where: {
                id: interviewerId
            },
            data: {
                status: status
            }
        })

        res.status(201).json({ message: "inteview updated successfully", updatedInterview: updatedInterview });
        return
    } catch (error:any) {
        console.log(error.message)
        res.status(500).json({ error: 'Failed to update interview status' });
        return;
    }
}

export const deleteInterview = async (req: Request, res: Response): Promise<void> => {

    try {
        const { interviewId } = req.params;

        const deletedInterview = await prisma.interview.delete({
            where: {
                id: interviewId
            }
        })

        res.status(201).json({ message: "inerview deleted successfully", deleteInterview: deletedInterview });
        return
    } catch (error) {
        res.status(500).json({ message: "failed to delete interview" });
        return
    }
}