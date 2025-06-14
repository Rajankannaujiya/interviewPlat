import { Router } from "express";
import { createInterview, deleteInterview, getAllMyInterviews, getInterviewById, rescheduleInterview, updateInterviewStatus } from "../controllers/interview";

const router = Router();

router.get("/", getAllMyInterviews);
router.get("/:interviewId", getInterviewById);
router.post("/create", createInterview);
router.post("/:interviewId/reschedule", rescheduleInterview)
router.patch("/:interviewerId/status", updateInterviewStatus);
router.delete("/:interviewId", deleteInterview);



export default router;