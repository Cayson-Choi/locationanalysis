import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export type GeminiModel = 'gemini-2.0-flash' | 'gemini-2.0-flash-lite' | 'gemini-1.5-pro';

export async function generateContent(
  prompt: string,
  systemPrompt: string,
  model: GeminiModel = 'gemini-2.0-flash-lite'
) {
  const client = getClient();
  const genModel = client.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });

  const result = await genModel.generateContent(prompt);
  return result.response.text();
}

export async function* generateContentStream(
  prompt: string,
  systemPrompt: string,
  model: GeminiModel = 'gemini-2.0-flash-lite'
) {
  const client = getClient();
  const genModel = client.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });

  const result = await genModel.generateContentStream(prompt);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
