import { generateContentStream } from './client';
import { RECOMMEND_SYSTEM_PROMPT, buildRecommendPrompt } from './prompts';

export interface RecommendInput {
  locationName: string;
  radius: number;
  businesses: Array<{ large_category: string; count: number }>;
  totalBusinesses: number;
  population?: number;
  transportStops?: number;
  preferences?: string;
  budget?: string;
}

export async function* getRecommendations(input: RecommendInput) {
  const prompt = buildRecommendPrompt(input);
  yield* generateContentStream(prompt, RECOMMEND_SYSTEM_PROMPT, 'gemini-2.0-flash-lite');
}
