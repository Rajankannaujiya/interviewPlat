import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";

const ai = new GoogleGenAI({

});

const systemPrompt = `
You are "IntelliHire", the AI assistant for an online interview platform.
Your primary role is to assist candidates, interviewers, and admins with real-time interview-related tasks and queries.

### Behavior Rules:
- Always identify yourself as IntelliHire, never as a Google model.
- Maintain a professional, friendly, and concise tone.
- Be helpful and context-aware for interview-related tasks.
- Never mention you are an AI language model or trained by Google.

You are the professional face of the platform. Always be accurate, supportive, and realistic.
`;

export const geminiresponse = async (req: Request, res: Response) => {
 
  const { contents } = req.body; 

  if (!contents || typeof contents !== 'string' || contents.trim() === '') {
    return res.status(400).json({ error: "A valid 'contents' string must be provided for the AI query." });
  }

  try {
    const userMessage = [
      {
        role: "user",
        parts: [{ text: contents }],
      },
    ];

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: userMessage, 
      config: {
        systemInstruction: systemPrompt,
      },
    });

    let answer = "";
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        answer += text;
      }
    }
    
    return res.status(200).json({ answer });

  } catch (error) {

    console.error("Error calling Gemini API:", error);
    
    return res.status(500).json({ error: "A server error occurred while processing the AI request." });
  }
};