import { Router } from "express";
import { signup } from "../controllers/auth";


const router = Router();

router.get("/", signup);


export default router;