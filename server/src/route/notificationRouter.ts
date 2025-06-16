import { Router } from "express";
import { deleteMyNotifications, getMyNotifications } from "../controllers/notification";


const router = Router();

router.get("/", getMyNotifications);
router.delete("/", deleteMyNotifications)


export default router;