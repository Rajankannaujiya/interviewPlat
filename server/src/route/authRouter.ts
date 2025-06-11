import { Router } from "express";
import { signup, login } from "../controllers/auth";


const router = Router();

router.get("/", signup);
router.get("/login", login)


export default router;