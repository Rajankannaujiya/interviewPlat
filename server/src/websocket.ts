import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

export function setUpWebsocketServer(server:Server){


const wss = new WebSocketServer({server});

wss.on("connection",(ws:WebSocket)=>{

    console.log("connection established");

    ws.on("message", (data: string)=>{

        try {   
            const message = JSON.parse(data)
            console.log("this is the data",data)
        } catch (error) {
            console.log("an error occured in data message",error)
        }
       
    });

    ws.on("close",()=>{
        console.log("user is disconnected");
    })
})
}