import { Router } from "express";
import { createInterview, deleteInterview, getAllMyInterviews, getInterviewById, updateInterviewStatus } from "../controllers/interview";

const router = Router();

router.get("/", getAllMyInterviews);
router.get("/:interviewId", getInterviewById);
router.post("/create", createInterview);
router.patch("/:interviewerId/status", updateInterviewStatus);
router.delete("/:interviewId", deleteInterview);



export default router;