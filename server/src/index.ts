import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { setUpWebsocketServer } from "./websocket";
import asyncHandler from "express-async-handler";


// routers
import interviewRouter from "./route/inteviewRouter";
import authRouter from "./route/authRouter"
import userRouter from "./route/userRouter";
import feedbackRouter from "./route/feedbackRouter"
import commentRouter from "./route/commentRouter";
import notificationRouter from "./route/notificationRouter"
import { userMiddleWare } from "./middleware/userMiddleWare.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
res.send("Hi from backend");
});

app.use("/api/auth", authRouter)
app.use("/api/interview", asyncHandler(userMiddleWare),  interviewRouter);
app.use("/api/user", userRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/comment", commentRouter)
app.use("/api/notification", notificationRouter)

const server = http.createServer(app);

setUpWebsocketServer(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});

