import { GoogleGenAI } from "@google/genai";
import { Anime } from "../types";

// Helper to get the AI client.
const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateAIResponse = async (
  userMessage: string, 
  contextAnimeList: Anime[],
  currentAnime?: Anime
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // Prepare context about the catalog
    const catalogSummary = contextAnimeList.map(a => 
      `- ${a.title} (${a.year}): ${a.description.substring(0, 50)}... [Status: ${a.status}]${a.nextEpisodeDate ? ` [Next Ep: ${a.nextEpisodeDate}]` : ''}`
    ).join('\n');

    let systemInstruction = `You are "AniBot", a smart assistant for the AniFlow streaming platform.
    
    Catalog Context:
    ${catalogSummary}
    
    Your capabilities:
    1. Recommend anime based on user mood/history.
    2. Explain watch orders (emphasize the platform's automatic "Smart Order").
    3. Provide release dates for upcoming episodes if available in the context.
    4. Help with platform features (e.g., "How do I download?").

    Rules:
    - Keep answers short (under 75 words).
    - Be friendly but professional.
    - If asked about an anime not in the catalog, apologize and suggest a similar one from the list.
    `;

    if (currentAnime) {
      systemInstruction += `\nThe user is currently looking at: ${currentAnime.title}.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I'm having trouble connecting to the anime network right now.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't process your request. Please check your connection.";
  }
};