'use server';

/**
 * @fileOverview A Genkit tool for searching YouTube videos.
 * - searchYouTubeVideosTool - A tool that searches for YouTube videos based on a query.
 */

import { ai } from '@/ai/genkit';
import { searchYouTube } from '@/services/youtube';
import { z } from 'zod';

export const searchYouTubeVideosTool = ai.defineTool(
  {
    name: 'searchYouTubeVideosTool',
    description: 'Search for YouTube videos based on a query.',
    inputSchema: z.object({
      query: z.string().describe('The search query for YouTube videos.'),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string().describe('The title of the video.'),
        thumbnail: z
          .string()
          .describe(
            'The URL of the YouTube video thumbnail (must be a valid i.ytimg.com URL, specifically hqdefault.jpg).'
          ),
        link: z
          .string()
          .describe(
            'The URL of the YouTube video (must be a valid youtube.com/watch link).'
          ),
      })
    ),
  },
  async ({ query }) => {
    return await searchYouTube(query);
  }
);
