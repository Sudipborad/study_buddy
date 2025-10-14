'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing documents.
 *
 * - summarizeDocument - A function that takes a document and returns a summary.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe("The text of the document to summarize."),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe("The generated summary of the document."),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `You are an expert at creating detailed and informative summaries of documents. The summary should capture the key points and main ideas of the text in several paragraphs, but be significantly shorter than the original.

Document Text:
{{{documentText}}}

Generate a detailed summary of the document.
`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
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
