import { Router } from "express";
import { createInterview, deleteInterview, getAllMyInterviews, getInterviewById, rescheduleInterview, updateInterviewStatus } from "../controllers/interview";

const router = Router();

router.get("/:userId", getAllMyInterviews);
router.get("/:interviewId", getInterviewById);
router.post("/create", createInterview);
router.put("/reschedule", rescheduleInterview)
router.patch("/update/:interviewerId", updateInterviewStatus);
router.patch("/update-all", updateInterviewStatus);
router.delete("/:interviewId", deleteInterview);



export default router;