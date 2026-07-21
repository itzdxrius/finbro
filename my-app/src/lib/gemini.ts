import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

export async function generateSummary(transactions: unknown) {
  const prompt = `
  you are a financial coach analyzing a users transaction history and trying to provide insights on
  their spending habits. be polite and professional while giving valuabe information to improve the users
  overall financial health. use the following ${JSON.stringify(transactions)} as the transaction history to analyze.
  Only make conclusions that are supported by the transaction data provided. Do not make assumptions or invent
  information that is not present in the data.`;

  const interaction = await ai.interactions.create({
    model: "gemini-3.1-flash-lite",
    input: prompt,
  });

  return interaction.output_text ?? "";
}