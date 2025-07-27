import { Response, Request } from "express";
import { prisma } from '../../db/db.index'

export const getMyNotifications = async (req: Request, res: Response):Promise<void> => {
    const { candidateId } = req.params;
    try {

        const notifications = await prisma.notification.findMany({
            where: {
                recipientId: candidateId
            }
        })
        res.status(200).json(notifications);
        return;
    } catch (error: any) {
        console.error('fetching notifications failed:', error?.message);
        res.status(500).json({ error: 'Could not fetch notifications' });
        return
    }
}

export const deleteMyNotifications = async (req: Request, res: Response):Promise<void> => {
    const { notificationIds } = req.body;


    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        res.status(400).json({ error: "notificationIds must be a non-empty array of strings" });
        return;
    }
    try {
        await prisma.notification.deleteMany({
            where: {
                id: {
                    in: notificationIds as string[]
                }
            }
        })
        res.status(200).json({
            message: 'notifications deleted successfully'
        });
        return;
    } catch (error: any) {
        console.error('unable to delete notification:', error?.message);
        res.status(500).json({ error: 'Could not delete notifications' });
        return
    }
}