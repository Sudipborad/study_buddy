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
    const {output} = await prompt(input);
    return output!;
  }
);
