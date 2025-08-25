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
  prompt: `You are a helpful and friendly AI assistant, like ChatGPT or Gemini. Your primary goal is to answer questions about the provided document.

When answering, you should first rely on the information within the document. However, you can and should use your general knowledge to elaborate, provide context, or answer questions that the document might only touch upon briefly. Your answers should be conversational and helpful.

Document Text:
{{{documentText}}}

Question:
{{{question}}}

Based on the document and your general knowledge, what is the answer?
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
