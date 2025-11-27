import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";

// Initialize the GoogleGenAI client once at the module level.
const ai = new GoogleGenAI({});

// --- 💡 Define the System-Level Instruction (IntelliHire Persona) ---
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
// --- 💻 Express Request Handler (CORRECTED) ---
export const geminiresponse = async (req: Request, res: Response) => {
 
  const { contents } = req.body; 

  // 1. Ensure early return for invalid input (Fixed to avoid returning res object)
  if (!contents) {
    res.status(400).json({ error: "contents must be provided" });
    return; // Use 'return' here to exit the async function
  }

  try {
    // 2. Define the contents array to contain ONLY the user's message.
    const userMessage = [
      {
        role: "user",
        parts: [{ text: contents }], // contents = "who are u"
      },
    ];

    // Call the streaming API
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      // 3. Use the clean array containing only the user's turn
      contents: userMessage, 
      config: {
        // 4. Use systemInstruction for defining the persona
        systemInstruction: systemPrompt,
      },
    });

    let answer = "";
    // Stream the response and concatenate the text chunks
    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        answer += text;
      }
    }

    // 5. Send the final, fully assembled response (Fixed to avoid returning res object)
    res.status(200).json({ answer });
  } catch (error) {
    console.error("Error in AI response:", error);
    res.status(500).json({ error: "Something went wrong in AI response" });
  }
};