import { Response, Request } from "express";
import { prisma } from '../../db/db.index'

export const getAllCandidate = async(req:Request ,res:Response):Promise<any>=>{
    try {
        const candidates =await prisma.user.findMany({where:{
            role:"CANDIDATE"
        }});
        return res.status(200).json(candidates);
    } catch (error) {
        console.log("An error occured while fetching all Users");
        return res.status(400).json({error:"error fetching the data"})
    }
}

export const getAllInterviewer = async(req:Request ,res:Response):Promise<any>=>{
    try {
        const interviewers =await prisma.user.findMany({where:{
            role:"INTERVIEWER"
        }});
        return res.status(200).json(interviewers);
    } catch (error) {
        console.log("An error occured while fetching all Users");
        return res.status(400).json({error:"error fetching the data"})
    }
}

export const getUserById = async(req:Request ,res:Response):Promise<any>=>{
  const {userId} = req.params;
    try {
        const user =await prisma.user.findUnique({where:{
            id: userId
        }});
        return res.status(200).json(user);
    } catch (error) {
        console.log("An error occured while fetching the user");
        return res.status(400).json({error:"error fetching the data"})
    }
}



export const getAllUsers = async(req:Request ,res:Response):Promise<any>=>{
    try {
        const allUser =await prisma.user.findMany();
        return res.status(200).json(allUser);
    } catch (error) {
        console.log("An error occured while fetching all Users");
        return res.status(400).json({error:"error fetching the data"})
    }
}

export const searchUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, userId } = req.query;
    const currentUserId = userId // 👈 adjust this based on your auth setup

    if (!query || (query as string).trim().length < 3 || !userId) {
      return res.status(200).json({ results: [] });
    }

    const q = query as string;

    // Step 1: Search users by username
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: q,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        username: true,
        profileUrl: true
      },
      take: 5
    });

    // Step 2: Messages where current user is sender or recipient AND content matches query
    const messages = await prisma.message.findMany({
      where: {
        content: {
          contains: q,
          mode: "insensitive"
        },
        OR: [
          { senderId: currentUserId as string },
          { receiverId: currentUserId as string}
        ]
      },
      select: {
        id: true,
        content: true,
        sender: {
          select: {
            id: true,
            username: true,
            profileUrl: true
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            profileUrl: true
          }
        }
      },
      take: 5
    });

    // Step 3: Comments where current user is author and content matches query
    const comments = await prisma.comment.findMany({
      where: {
        content: {
          contains: q,
          mode: "insensitive"
        },
        authorId: currentUserId as string,
      },
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            username: true,
            profileUrl: true
          }
        },
        interviewId: true
      },
      take: 5
    });

    // Step 4: Combine results with types
    const results = [
      ...users.map(u => ({ type: "user", data: u })),
      ...messages.map(m => ({ type: "message", data: m })),
      ...comments.map(c => ({ type: "comment", data: c }))
    ];

    return res.status(200).json({ results });

  } catch (error) {
    console.error("Error during search", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getChattedUsersWithLastMessage = async (req: Request, res: Response) => {
  const { userId } = req.params;

  console.log("chatsWithuser", userId)

  try {
    // 1. Fetch all messages where the user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' }, // so latest message comes first
      include: {
        sender: true,
        recipient:true
      }
    });

    // 2. Map to chat partner -> latest message
    const chatMap = new Map<string, { user: any, message: any }>();

    for (const msg of messages) {
      const isSender = msg.senderId === userId;
      const otherUser = isSender ? msg.recipient : msg.sender;
      const key = otherUser.id;

      if (!chatMap.has(key)) {
        chatMap.set(key, {
          user: otherUser,
          message: {
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            senderId: msg.senderId,
            recipientId: msg.receiverId
          }
        });
      }
    }

    const result = Array.from(chatMap.values());
    res.json(result);

  } catch (error) {
    console.error("Error fetching chatted users with last message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

