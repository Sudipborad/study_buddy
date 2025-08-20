'use server';
/**
 * @fileOverview A video recommendation AI agent.
 *
 * - recommendVideos - A function that handles the video recommendation process.
 * - RecommendVideosInput - The input type for the recommendVideos function.
 * - RecommendVideosOutput - The return type for the recommendVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendVideosInputSchema = z.object({
  documentSummary: z
    .string()
    .describe('A summary of the uploaded document.'),
});
export type RecommendVideosInput = z.infer<typeof RecommendVideosInputSchema>;

const VideoRecommendationSchema = z.object({
  title: z.string().describe('The title of the video.'),
  thumbnail: z.string().describe('The URL of the YouTube video thumbnail (hqdefault.jpg).'),
  link: z.string().describe('The URL of the video.'),
});

const RecommendVideosOutputSchema = z.array(VideoRecommendationSchema).describe('A list of recommended videos.');
export type RecommendVideosOutput = z.infer<typeof RecommendVideosOutputSchema>;

export async function recommendVideos(input: RecommendVideosInput): Promise<RecommendVideosOutput> {
  return recommendVideosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendVideosPrompt',
  input: {schema: RecommendVideosInputSchema},
  output: {schema: RecommendVideosOutputSchema},
  prompt: `You are a video recommendation expert. Given the summary of a document, you will recommend relevant videos from YouTube.

Summary: {{{documentSummary}}}

Return a list of video recommendations, including the title, a valid i.ytimg.com thumbnail link, and the link for each video.`,
});

const recommendVideosFlow = ai.defineFlow(
  {
    name: 'recommendVideosFlow',
    inputSchema: RecommendVideosInputSchema,
    outputSchema: RecommendVideosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
