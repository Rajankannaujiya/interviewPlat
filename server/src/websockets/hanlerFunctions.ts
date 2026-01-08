import { prisma } from "../db/db.index";
import { RawData, WebSocket} from "ws"
import { messageSchema } from "../zod/schema";
import { TypeAiChatSchema, TypeExitChatSchema, TypeInitMessageSchema, TypeNewMessageSchema, TypeWebRTCSchema } from "../zod/type";
import { GoogleGenAI } from "@google/genai";
import { handleAnswer, handleIceCandidate, handleJoinWebRTC, handleLeave, handleOffer } from "./signalling";

export const clients: Map<string, WebSocket> = new Map(); // userId -> WebSocket

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
    



export async function handleMessage(data:RawData, ws:WebSocket){
    let parsed;
    try {
        parsed = JSON.parse(data.toString());
    } catch (e) {
        console.error("Invalid JSON received",e);
        return;
    }

    console.log(parsed);
    const result = messageSchema.safeParse(parsed);
    if (!result.success) {
        console.error("Invalid message schema", result.error);
        return;
    }else{
        const message = result.data;
        switch(message.type){
            case "initWs":
                console.log("inside init", message)
                await initChat(message, ws);
                break;

            case "chat_message":
                handleChat(message);
                break;

            case "exit_chat":
                handleExitChat(message, ws);
                break;

            case "webrtc_connection":
                handleWebRtcConnection(message, ws);
                break;

            default:
                console.log("the type of the message is not matched", message)
        }
    }
}


async function initChat(message:TypeInitMessageSchema, ws:WebSocket) {
    const {userId} = message.payload
    if(userId && !clients.get(userId)){
        (ws as any).userId = userId;
        clients.set(userId, ws); // Save userId with socket
        console.log(`User ${userId} connected`);
        return;
    }
}

async function handleChat(data:any){
    console.log("data from handleChat", data.payload)
    const {chatId, senderId, receiverId, content}= data.payload
    try {
        const saveMessage = await prisma.message.create({
            data:{
                chatId,
                senderId,
                receiverId,
                content
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        profileUrl: true,
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        username: true,
                        profileUrl: true,
                    }
                }
            }
        })
        const messagePayload = {
            type: 'new_message' as const,
            payload: saveMessage
        };

        broadCast(chatId, messagePayload);
    } catch (error:any) {
        console.error("An error occured in the handleChat", error.message)
    }
    
}

async function broadCast(chatId:string, message:TypeNewMessageSchema){
    console.log("in the broadcast", message)
    try {
        const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        select: {
            participants: {select:{
                id:true
            }}
        }
        });


        chat?.participants.forEach(({ id: userId }) => {
            console.log( "int the braodcast",userId)
            const ws = clients.get(userId);
            console.log( "int the braodcast",userId)    
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
            }
        });
    } catch (error) {
        console.log("Unable to broadcast message", error)   
    }
}

export function handleExitChat(message:TypeExitChatSchema, ws:WebSocket) {
    console.log("this is the data from chatExit", message)
    try {
        const {userId} = message?.payload;
        console.log(userId)

        const foundWs = clients.get(userId);
        if(foundWs && foundWs===ws){
            clients.delete(userId);
            console.log(`${userId} disconnected`);
            ws.close();
        }
    } catch (error) {
        console.log("An error occured in handleExitChat", error);   
    }
}

export function handleWebRtcConnection(message: TypeWebRTCSchema, ws:WebSocket){
    
    if(message.payload.action === "JOIN"){
        handleJoinWebRTC(message, ws);
    }
    else if(message.payload.action === "OFFER"){
        // received offer send the answer now
        handleOffer(message);
    }
    else if(message.payload.action === "ANSWER"){
        // received answer send to the other peer
        handleAnswer(message);
    }
    else if(message.payload.action === "ICE_CANDIDATE"){
        // received the ice candidate
        console.log("received ice candidate",message)
        handleIceCandidate(message);
    }
    else if(message.payload.action === "LEAVE" ){
        handleLeave(message, ws);
    }
}

