import { Router } from "express";
import { createChat, findChatById } from "../controllers/messages/message";
import { geminiresponse } from "../controllers/ai/gemini";


const router = Router();

router.post("/createChat", createChat);
router.get("/findChat/:chatId", findChatById);
router.post("/geminiAiResponse", geminiresponse)

export default router;