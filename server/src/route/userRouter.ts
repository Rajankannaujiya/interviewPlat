import { Router } from "express";
import { user } from "../controllers/user";


const router = Router();

router.get("/", user);


export default router;