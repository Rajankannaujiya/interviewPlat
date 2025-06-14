import { Response, Request } from "express";
import { prisma } from '../../db/db.index'
import { InterViewStatus, Prisma } from "@prisma/client";
import { sendInteviewScheduleMail, sendSms } from "../../utils/smsAndMails/config";


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

        if (candidate.email && interviewer.email) {
            await sendInteviewScheduleMail(
                "Interview Scheduled",
                `Hello ${candidate.username},\n\nyour interview with ${interviewer.username} is scheduled at: ${new Date(scheduledTime).toLocaleString()}`,
                candidate.email
            );

            await sendInteviewScheduleMail(
                "Interview Scheduled",
                `Hello ${interviewer.username},\n\nyou schedule an interview with ${candidate.username} at: ${new Date(scheduledTime).toLocaleString()}`,
                interviewer.email
            )
        }

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
    } catch (error: any) {
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



export const rescheduleInterview = async (req: Request, res: Response): Promise<void> => {
    const { interviewId } = req.params;
    const { newDateTime } = req.body;

    if (!newDateTime || !interviewId) {
        res.status(400).json({ error: 'newDateTime is required' });
        return;
    }

    const formattedTime = new Date(newDateTime).toLocaleString()

    try {

        const checkStatus = await prisma.interview.findUnique({
            where: {
                id: interviewId
            }
        });
        // Update interview date

        const blockedStatuses = ["CANCELLED", "COMPLETED", "ONGOING"];

        if (blockedStatuses.includes(checkStatus?.status ?? "")) {
            res.status(400).json({ error: `Cannot reschedule interview because it is already ${checkStatus?.status}` });
            return;
        }

        const interview = await prisma.interview.update({
            where: { id: interviewId },
            data: {
                scheduledTime: new Date(newDateTime),
            },
            include: {
                candidate: true,
                interviewr: true,
            },
        });

        // Create notifications for both users
        const notifications: Prisma.NotificationCreateManyInput[] | undefined = [
            {
                type: 'RESCHEDULE',
                recipientId: interview.candidateId,
                message: `Your interview has been rescheduled to ${new Date(newDateTime).toLocaleString()}`,
                status: 'PENDING',
                channel: interview?.candidate?.isEmailVerified ? "EMAIL" : "SMS",
            },
            {
                type: 'RESCHEDULE',
                recipientId: interview.interviewerId,
                message: `An interview you're scheduled to conduct has been rescheduled to ${new Date(newDateTime).toLocaleString()}`,
                status: 'PENDING',
                channel: interview.interviewr.isEmailVerified ? "EMAIL" : "SMS",
            },
        ];



        await prisma.notification.createMany({
            data: notifications
        });

        // (Optional) Send actual emails or SMS here (not shown)

        if (interview.candidate) {
            if (interview.candidate.isEmailVerified && interview.candidate.email) {
                await sendInteviewScheduleMail(
                    "Interview Scheduled",
                    `Hello ${interview.candidate.username},\n\nYour interview with ${interview.interviewr.username} has been rescheduled to ${formattedTime}`,
                    interview.candidate.email
                );
            } else if (interview.candidate.isMobileVerified && interview.candidate.mobileNumber) {
                await sendSms(
                    `Hello ${interview.candidate.username}, your interview with ${interview.interviewr.username} has been rescheduled to ${formattedTime}`,
                    interview.candidate.mobileNumber
                );
            }
        }

        if (interview.interviewr) {
            if (interview.interviewr.isEmailVerified && interview.interviewr.email) {
                await sendInteviewScheduleMail(
                    "Interview Scheduled",
                    `Hello ${interview.interviewr.username},\n\nAn interview you're scheduled to conduct has been rescheduled to ${formattedTime}`,
                    interview.interviewr.email
                );
            } else if (interview.interviewr.isMobileVerified && interview.interviewr.mobileNumber) {
                await sendSms(
                    `Hello ${interview.interviewr.username}, an interview you're scheduled to conduct has been rescheduled to ${formattedTime}`,
                    interview.interviewr.mobileNumber
                );
            }
        }
        res.status(200).json({
            message: 'Interview rescheduled and notifications created.',
        });
        return;
    } catch (error) {
        console.error('Reschedule failed:', error);
        res.status(500).json({ error: 'Could not reschedule interview' });
        return
    }
}