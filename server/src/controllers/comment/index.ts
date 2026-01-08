import { Response, Request } from "express";
import { prisma } from '../../db/db.index'


export const createComment = async (req: Request, res: Response): Promise<void> =>{
    const { interviewId, content, authorId } = req.body;

    try {

        const comment = await prisma.comment.create({
            data:{
                interviewId,
                authorId:authorId,
                content:content
            }
        })

        console.log(comment);
        
        res.status(201).json({ message: "comment created successfully", comment: comment });
        return
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
        return;
    }
}

// no need for this already getting in the interview
export const getAllComment = async (req: Request, res: Response): Promise<void> =>{
    const { interviewId } = req.params;

    try {

        const comment = await prisma.interview.findMany({
            where:{
                id:interviewId
            },
            include:{
                Comment:true
            }
        })
        
        res.status(201).json({ message: "comments fetched successfully", comment: comment });
        return
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comment' });
        return;
    }
}

export const updateComment = async (req: Request, res: Response): Promise<void> =>{
    const { commentId, content } = req.body;

    try {

        const comment = await prisma.comment.update({
            where:{
                id:commentId
            }, 
            data:{
                content
            }
        })
        
        res.status(201).json({ message: "comment updated successfully", comment: comment });
        return
    } catch (error) {
        res.status(500).json({ error: 'Failed to update comment' });
        return;
    }
}

export const deleteComment = async (req: Request, res: Response): Promise<void> =>{
    const { commentId, content } = req.params;

    try {

        const comment = await prisma.comment.delete({
            where:{
                id:commentId
            }
        })
        
        res.status(201).json({ message: "comment deleted successfully", comment: comment });
        return
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
        return;
    }    
}
