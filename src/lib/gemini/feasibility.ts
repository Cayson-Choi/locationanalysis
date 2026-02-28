import { generateContentStream } from './client';
import { FEASIBILITY_SYSTEM_PROMPT, buildFeasibilityPrompt } from './prompts';

export interface FeasibilityInput {
  locationName: string;
  radius: number;
  businessType: string;
  businesses: Array<{ large_category: string; count: number }>;
  totalBusinesses: number;
  sameTypeCount: number;
  population?: number;
  transportStops?: number;
  avgRent?: number;
  businessName?: string;
  investment?: string;
}

export async function* getFeasibilityAnalysis(input: FeasibilityInput) {
  const prompt = buildFeasibilityPrompt(input);
  yield* generateContentStream(prompt, FEASIBILITY_SYSTEM_PROMPT, 'gemini-2.0-flash');
}
