
import { GoogleGenAI, Type } from "@google/genai";

export interface AISuggestion {
  suggestion: string;
  rationale: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses AI to suggest a "next action" for a given to-do title.
 * @param todoTitle The title of the to-do item.
 * @returns A promise that resolves to an AISuggestion.
 */
export const suggestNextAction = async (todoTitle: string): Promise<AISuggestion> => {
  const prompt = `Given the to-do item "${todoTitle}", suggest a concrete next action to take to get started on it. Also provide a brief rationale for why it's a good next step.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: {
              type: Type.STRING,
              description: "The suggested next action.",
            },
            rationale: {
              type: Type.STRING,
              description: "The rationale behind the suggestion.",
            },
          },
          required: ["suggestion", "rationale"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('AI suggestion failed:', error);
    // Provide a generic fallback suggestion on error for a better UX.
    return {
      suggestion: 'Break down the task into smaller sub-tasks.',
      rationale: 'This is a good general first step for any complex task.'
    };
  }
};
