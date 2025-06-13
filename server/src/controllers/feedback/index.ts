import { Response, Request } from "express";
import { prisma } from '../../db/db.index'


export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
    const { interviewId } = req.params;
    const { rating, note } = req.body;

    console.log(req.body)

    if (rating === undefined && note === undefined) {
        res.status(400).json({ message: "At least one of 'rating' or 'note' must be provided." });
        return;
    }
    try {
        const existing = await prisma.feedback.findUnique({
            where: { interviewId: interviewId }
        });

        let feedback;
            if (existing) {
                const updateData: { rating?: number; note?: string } = {};
                if (rating !== undefined) updateData.rating = Number(rating);
                if (note !== undefined) updateData.note = String(note);

                feedback = await prisma.feedback.update({
                    where: { 
                        interviewId: interviewId
                     },
                    data: updateData
                });
            } else {
                feedback = await prisma.feedback.create({
                    data: {
                        interviewId: interviewId,
                        rating,
                        note
                    }
                });
            }

        res.status(201).json({ message: "Feedback submitted successfully", feedback: feedback });

        return
    } catch (err:any) {
        console.log(err.message)
        res.status(500).json({ message: "Feedback submission failed" });
        return
    }
}

export const getInterviewFeedback = async (req: Request, res: Response): Promise<void> => {
    const { interviewId } = req.params;

    try {
        const interview = await prisma.interview.findUnique({
            where: {
                id: interviewId
            },
            include:{
                feedback:true
            }
        })

        if (!interview) {
            res.status(404).json({ message: "Interview not found" });
            return
        }

        res.status(201).json({ message: "inteview with feedback fetched successfully", interview: interview });
        return

    } catch (error) {
        res.status(500).json({ error: 'Failed to get interview with feedback' });
        return;
    }
}

export const deleteFeedback = async (req: Request, res: Response): Promise<void> => {
    const { feedbackId } = req.params;

    try {
        const feedback = await prisma.feedback.delete({
            where: {
                id:feedbackId
            }
        })

        res.status(201).json({ message: "inteview feedback deleted successfully", deletedFeedback: feedback });
        return

    } catch (error) {
        res.status(500).json({ error: 'Failed to delete Feedback' });
        return;
    }
}

