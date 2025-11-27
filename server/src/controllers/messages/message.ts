import { Response, Request } from "express";
import { prisma } from '../../db/db.index'

export const createChat = async (req: Request, res: Response): Promise<any> => {
    const { senderId, receiverId } = req.body;

    try {
        const existingChat = await prisma.chat.findFirst({
            where: {
                participants: {
                    every: {
                        id: { in: [senderId, receiverId] },
                    },
                },
            },
            include: { participants: true, messages: true },
        });
        if (existingChat) return res.json(existingChat);

        // Else, create a new chat
        const newChat = await prisma.chat.create({
            data: {
                participants: {
                    connect: [{ id: senderId }, { id: receiverId }],
                },
            },
            include: { participants: true },
        });

        return res.json(newChat);
    } catch (error) {
        console.log("an error occured while creating the message");
        return res.status(400).json({ error: "error fetching the data" })

    }
}

export const findChatById = async (req: Request, res: Response): Promise<any> => {
    const { chatId } = req.params;
    try {
        const messages = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' }, // chronological order
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        profileUrl: true,
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        username: true,
                        profileUrl: true,
                    }
                }
            }
        });
        return res.json(messages);
    } catch (error) {
        console.log("an error occured while finding the message");
        return res.status(400).json({ error: "error fetching the data" })
    }
}