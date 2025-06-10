import { Router } from "express";
import { getInterview } from "../controllers/interview";

const router = Router();

router.get("/", getInterview);


export default router;