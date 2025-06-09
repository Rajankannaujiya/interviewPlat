import express from "express"
import {interview} from "./controllers/interview"

const app = express();
interview()

app.use(express.json());

app.get("/", (req,res)=>{
    res.send("hii from backend")
})

const port =process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`the server is listening on the http://localhost:${port}`)
})