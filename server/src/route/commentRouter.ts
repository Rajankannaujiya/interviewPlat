import { Router } from "express";
import { getAllComment, createComment, updateComment, deleteComment } from "../controllers/comment";

const router = Router();

router.get("/:interviewId", getAllComment)
router.post("/", createComment)
router.put("/update", updateComment)
router.delete("/:commentId", deleteComment)

export default router;