'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quizzes from study materials.
 *
 * - generateQuiz - A function that takes study materials as input and returns a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  studyMaterial: z
    .string()
    .describe("The study material to generate a quiz from."),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(z.object({
    question: z.string().describe("The quiz question."),
    options: z.array(z.string()).describe("A list of multiple-choice options."),
    answer: z.string().describe("The correct answer from the options."),
  })).describe("An array of quiz questions."),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert educator who can create multiple-choice quizzes from provided study material. For each question, provide four options, one of which is the correct answer.

Study Material: {{{studyMaterial}}}

Create a quiz based on the study material. Return a JSON array of questions.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
