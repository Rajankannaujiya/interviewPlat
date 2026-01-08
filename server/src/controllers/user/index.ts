import { Response, Request } from "express";
import { prisma } from '../../db/db.index'
import { Role } from "@prisma/client";

export const getAllCandidate = async(req:Request ,res:Response):Promise<any>=>{
    try {
        const candidates =await prisma.user.findMany({where:{
            role: { has: Role.CANDIDATE },
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
            role:{has:Role.INTERVIEWER}
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

  try {
    // Step 1: Get all chats where user is a participant
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            profileUrl: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    // Step 2: Format results to exclude current user from participants
    const result = chats.map(chat => {
      const otherUser = chat.participants.find(p => p.id !== userId);

      return {
        chatId: chat.id,
        user: otherUser, // the chat partner
        message: chat.messages[0] || null // latest message or null
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching chats with last message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateUserProfile = async (req: Request, res: Response): Promise<any> => {
  const { username, email, mobileNumber, imageUrl } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ message: "Username is required to identify user" });
    }
    const user = await prisma.user.findFirst({
      where: {
        username,
        OR: [
          email ? { email } : undefined,
          mobileNumber ? { mobileNumber } : undefined,
        ].filter(Boolean) as any[],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedData: any = {};
    if (email) updatedData.email = email;
    if (mobileNumber) updatedData.mobileNumber = mobileNumber;
    if (imageUrl) updatedData.profileUrl = imageUrl;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updatedData,
    });

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

