import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { setUpWebsocketServer } from "./websocket.js";


// routers
import interviewRouter from "./route/inteviewRouter";
import authRouter from "./route/authRouter"
import userRouter from "./route/userRouter.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
res.send("Hi from backend");
});

app.use("/api/interview", interviewRouter);
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

const server = http.createServer(app);

setUpWebsocketServer(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});

