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

  IMPORTANT: You MUST use the searchYouTubeVideosTool to find real videos. DO NOT generate fake video data.

  Steps:
  1. Create 2-3 concise search queries based on the document summary
  2. For each query, use searchYouTubeVideosTool to get real YouTube videos
  3. Return ONLY the videos found by the tool - do not modify titles, links, or thumbnails
  4. If no videos are found, return an empty array

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
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Video recommendation attempt ${attempt}/${maxRetries}`);
        const {output} = await prompt(input);
        
        if (!output || !Array.isArray(output)) {
          console.warn('No valid output received from AI');
          return [];
        }
        
        // Filter out any invalid video entries
        const validVideos = output.filter(video => 
          video && 
          typeof video.title === 'string' && 
          typeof video.link === 'string' && 
          video.title.length > 0 && 
          video.link.includes('youtube.com')
        );
        
        console.log(`Found ${validVideos.length} valid videos`);
        return validVideos;
        
      } catch (error: any) {
        lastError = error;
        console.error(`Video recommendation attempt ${attempt} failed:`, error.message);
        
        // Check if it's a 503 Service Unavailable error (like Gemini overload)
        if (error.status === 503 && attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`AI service overloaded, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If it's not retryable or last attempt, break
        break;
      }
    }
    
    console.error('All video recommendation attempts failed:', lastError?.message);
    return [];
  }
);
