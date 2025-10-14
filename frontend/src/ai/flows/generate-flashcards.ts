'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating flashcards from study materials.
 *
 * - generateFlashcards - A function that takes study materials as input and returns flashcards.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  studyMaterial: z
    .string()
    .describe("The study material to generate flashcards from."),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(z.object({
    front: z.string().describe("The front side of the flashcard."),
    back: z.string().describe("The back side of the flashcard."),
  })).describe("An array of flashcards."),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert educator who can create flashcards from provided study material. Each flashcard should have a concise question on the front and a detailed answer on the back.

Study Material: {{{studyMaterial}}}

Create flashcards based on the study material. Return a JSON array of flashcards.
`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error: any) {
        lastError = error;
        
        // Check if it's a 503 Service Unavailable error
        if (error.status === 503 && attempt < maxRetries) {
          // Wait for exponential backoff before retry (2s, 4s, 8s)
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`API overloaded, retrying in ${delay}ms... (attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If it's not a 503 or we've exhausted retries, throw the error
        throw error;
      }
    }
    
    throw lastError;
  }
);
