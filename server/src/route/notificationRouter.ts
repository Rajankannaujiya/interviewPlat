import { Router } from "express";
import { deleteMyNotifications, getMyNotifications } from "../controllers/notification";


const router = Router();

router.get("/:candidateId", getMyNotifications);
router.delete("/:candidateId", deleteMyNotifications)


export default router;