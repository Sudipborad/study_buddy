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
import { searchYouTubeVideosTool } from '../tools/youtube-search';

const RecommendVideosInputSchema = z.object({
  documentSummary: z
    .string()
    .describe('A summary of the uploaded document.'),
});
export type RecommendVideosInput = z.infer<typeof RecommendVideosInputSchema>;

const VideoRecommendationSchema = z.object({
  title: z.string().describe('The title of the video.'),
  thumbnail: z.string().describe('The URL of the YouTube video thumbnail (must be a valid i.ytimg.com URL, specifically hqdefault.jpg).'),
  link: z.string().describe('The URL of the YouTube video (must be a valid youtube.com/watch link).'),
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
  tools: [searchYouTubeVideosTool],
  prompt: `You are a helpful assistant that recommends YouTube videos based on the summary of a document. 
  
  First, come up with a list of 3-5 concise search queries based on the document summary.
  Then, for each search query, use the searchYouTubeVideosTool to find relevant videos.

  From the search results, select the top 1-2 most relevant videos for each query.
  
  Compile a final list of recommended videos, ensuring there are no duplicates. Each video must have a title, a valid YouTube link, and a valid thumbnail URL.

  Summary: {{{documentSummary}}}
  `,
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
