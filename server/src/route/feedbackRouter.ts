import { Router } from "express";
import { submitFeedback, getInterviewFeedback, deleteFeedback} from "../controllers/feedback";

const router = Router();

router.get("/:interviewId", getInterviewFeedback);
router.put("/:interviewId", submitFeedback);
router.delete("/:feedbackId", deleteFeedback);

export default router;