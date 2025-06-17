import { Response, Request } from "express";
import { prisma } from '../../db/db.index'
import { sendInteviewScheduleMail, sendSms } from "../../utils/smsAndMails/config";
import bullMqWorker from "../../utils/worker/notificationWorker";
import { statusSchema } from "../../zod/schema";



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
    const { status } = req.body;

    const parsedStatus = statusSchema.parse(status)

    try {
        const updatedInterview = await prisma.interview.update({
            where: { id: interviewerId },
            data: { status:parsedStatus.status }
        });

        if (parsedStatus.status  === "CANCELLED") {
            const [candidate, interviewer] = await Promise.all([
                prisma.user.findUnique({ where: { id: updatedInterview.candidateId } }),
                prisma.user.findUnique({ where: { id: updatedInterview.interviewerId } })
            ]);

            if (candidate) {
                const notification = await prisma.notification.create({
                    data: {
                        type: "CANCELLATION",
                        status: "PENDING",
                        channel: candidate.isEmailVerified ? "EMAIL" : "SMS",
                        recipientId: candidate.id,
                        message: `Your interview has been cancelled by ${interviewer?.username}`,
                    }
                });
                await bullMqWorker.addNotificationToQueue(notification.id);
            }

            if (interviewer) {
                const notification = await prisma.notification.create({
                    data: {
                        type: "CANCELLATION",
                        status: "PENDING",
                        channel: interviewer.isEmailVerified ? "EMAIL" : "SMS",
                        recipientId: interviewer.id,
                        message: `You cancelled the interview with ${candidate?.username}`,
                    }
                });
                await bullMqWorker.addNotificationToQueue(notification.id);
            }
        }

        res.status(201).json({
            message: "Interview updated successfully",
            updatedInterview
        });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to update interview status" });
    }
};

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
    const { interviewId, newDateTime } = req.body;

    if (!newDateTime || !interviewId) {
        res.status(400).json({ error: 'newDateTime is required' });
        return;
    }


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
        const [candidateNotification, interviewerNotification] = await Promise.all([
            prisma.notification.create({
                data: {
                    type: 'RESCHEDULE',
                    recipientId: interview.candidateId,
                    message: `Your interview has been rescheduled to ${new Date(newDateTime).toLocaleString()}`,
                    status: 'PENDING',
                    channel: interview?.candidate?.isEmailVerified ? "EMAIL" : "SMS",
                }
            }),
            prisma.notification.create({
                data: {
                    type: 'RESCHEDULE',
                    recipientId: interview.interviewerId,
                    message: `An interview you're scheduled to conduct has been rescheduled to ${new Date(newDateTime).toLocaleString()}`,
                    status: 'PENDING',
                    channel: interview.interviewr.isEmailVerified ? "EMAIL" : "SMS"
                }
            })
        ])

        if (candidateNotification) {
            await bullMqWorker.addNotificationToQueue(candidateNotification.id);
        }

        if (interviewerNotification) {
            await bullMqWorker.addNotificationToQueue(interviewerNotification.id);
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