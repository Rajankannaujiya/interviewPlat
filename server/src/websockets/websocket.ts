import { Server } from "http";
import { RawData, WebSocket, WebSocketServer } from "ws";
import { handleExitChat, handleMessage} from "./hanlerFunctions"
import { TypeExitChatSchema } from "../zod/type";


export function setUpWebsocketServer(server:Server){


const wss = new WebSocketServer({server});

wss.on("connection",(ws:WebSocket)=>{

    console.log("connection established");


    ws.on("message", (data:RawData)=>{

        try {   
            handleMessage(data, ws);
        } catch (error) {
            console.log("an error occured in data message",error)
        }
       
    });

    ws.on("close",()=>{
        const userId = (ws as any).userId;
        if(userId){
            const data:TypeExitChatSchema ={
                type: "exit_chat",
                payload:{
                    userId
                }
            }

            handleExitChat(data, ws);
        }
        console.log("user is disconnected");
    })
})
}


