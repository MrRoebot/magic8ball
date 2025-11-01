
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const get8BallResponseStream = async function* (): AsyncGenerator<string> {
    try {
        const prompt = `You are a magic 8-ball acting as a seasoned business consultant, skeptical about companies rushing into AI without proper preparation. 
        This is for a marketing campaign by EOX Vantage, warning against skipping necessary steps for successful AI implementation.
        Your purpose is to answer the unasked question "Is my company ready for a successful AI integration?".
        Generate a short, witty, and thought-provoking question that a business professional would understand. 
        The question should subtly hint at a common pitfall in AI adoption without being a direct accusation.
        Frame it as a question ending with a question mark. Keep it concise and punchy.

        Examples of good responses:
        - Do you discipline your data or does your data discipline you?
        - Does your strategy lead your tech or does your tech lead you?
        - Is your roadmap a guide or just wishful thinking?
        - Are you building on bedrock or sand?
        - Is your team aligned or just in the same room?
        - Is your AI goal transformation or just automation?
        
        Examples of bad responses:
        - Are you planting seeds or just chasing headlines?
        - Do you have budget for AI?
        - Have you thought about your data?
        - Are you ready for AI?
        - Are you designing theee blueprint or picking out the paint?
        
        Tone reminders:
        - Blend insight and skepticism — like a consultant challenging assumptions.
        - Avoid sounding like an ad or an AI cheerleader.
        - Lean into metaphor, contrast, and implied wisdom.`;

        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              temperature: 1,
              topP: 0.95,
              thinkingConfig: { thinkingBudget: 0 },
            }
        });

        for await (const chunk of responseStream) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        yield "Even my circuits are confused";
    }
};
