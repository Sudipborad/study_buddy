'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating interview quizzes.
 *
 * - generateInterviewQuiz - A function that takes skills and returns a quiz.
 * - GenerateInterviewQuizInput - The input type for the generateInterviewQuiz function.
 * - GenerateInterviewQuizOutput - The return type for the generateInterviewQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuizInputSchema = z.object({
  skills: z
    .array(z.string())
    .describe("A list of skills to generate interview questions for."),
});
export type GenerateInterviewQuizInput = z.infer<typeof GenerateInterviewQuizInputSchema>;

const GenerateInterviewQuizOutputSchema = z.object({
  questions: z.array(z.object({
    question: z.string().describe("The interview question."),
    options: z.array(z.string()).describe("A list of multiple-choice options."),
    answer: z.string().describe("The correct answer from the options."),
  })).describe("An array of quiz questions."),
});
export type GenerateInterviewQuizOutput = z.infer<typeof GenerateInterviewQuizOutputSchema>;

export async function generateInterviewQuiz(input: GenerateInterviewQuizInput): Promise<GenerateInterviewQuizOutput> {
  return generateInterviewQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuizPrompt',
  input: {schema: GenerateInterviewQuizInputSchema},
  output: {schema: GenerateInterviewQuizOutputSchema},
  prompt: `You are an expert technical recruiter who creates multiple-choice quizzes to screen candidates. For each question, provide four options, one of which is the correct answer. The questions should be relevant to the provided skills.

Skills:
{{#each skills}}
- {{{this}}}
{{/each}}

Create a quiz based on these skills. Return a JSON array of questions.
`,
});

const generateInterviewQuizFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuizFlow',
    inputSchema: GenerateInterviewQuizInputSchema,
    outputSchema: GenerateInterviewQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
