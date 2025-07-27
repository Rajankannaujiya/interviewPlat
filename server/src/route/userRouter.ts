import { Router } from "express";
import { getAllCandidate, getAllInterviewer, getAllUsers, getChattedUsersWithLastMessage, getUserById, searchUser } from "../controllers/user";


const router = Router();

router.get("/candidates", getAllCandidate);
router.get("/interviewers", getAllInterviewer)
router.get("/search",searchUser)
router.get("/chatsWith/:userId", getChattedUsersWithLastMessage);
router.get("/allUsers", getAllUsers);
router.get("/:userId", getUserById);


export default router;