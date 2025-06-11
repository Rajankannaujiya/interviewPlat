import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

export function setUpWebsocketServer(server:Server){


const wss = new WebSocketServer({server});


console.log("one time");

wss.on("connection",(ws:WebSocket)=>{

    console.log("connection established");

    ws.on("message", (message: string)=>{

        try {
            
            const data = JSON.parse(message)
            console.log(data)
        } catch (error) {
            
        }
       
    });

    ws.on("close",()=>{
        console.log("user is disconnected");
    })
})
}