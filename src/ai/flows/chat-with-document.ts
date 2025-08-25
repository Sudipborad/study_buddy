'use server';

/**
 * @fileOverview This file defines a Genkit flow for chatting with a document.
 *
 * - chatWithDocument - A function that takes a document and a question and returns an answer.
 * - ChatWithDocumentInput - The input type for the chatWithDocument function.
 * - ChatWithDocumentOutput - The return type for the chatWithDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe("The text of the document to chat with."),
  question: z
    .string()
    .describe("The user's question about the document."),
});
export type ChatWithDocumentInput = z.infer<typeof ChatWithDocumentInputSchema>;

const ChatWithDocumentOutputSchema = z.object({
  answer: z.string().describe("The generated answer to the question based on the document."),
});
export type ChatWithDocumentOutput = z.infer<typeof ChatWithDocumentOutputSchema>;

export async function chatWithDocument(input: ChatWithDocumentInput): Promise<ChatWithDocumentOutput> {
  return chatWithDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithDocumentPrompt',
  input: {schema: ChatWithDocumentInputSchema},
  output: {schema: ChatWithDocumentOutputSchema},
  prompt: `You are an expert AI assistant that can answer questions about a provided document. Your answers must be based solely on the information contained within the document text. Do not use any external knowledge. If the answer cannot be found in the document, state that clearly.

Document Text:
{{{documentText}}}

Question:
{{{question}}}

Based on the document, what is the answer to the question?
`,
});

const chatWithDocumentFlow = ai.defineFlow(
  {
    name: 'chatWithDocumentFlow',
    inputSchema: ChatWithDocumentInputSchema,
    outputSchema: ChatWithDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
