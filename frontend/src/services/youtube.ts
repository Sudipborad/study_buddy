/**
 * @fileOverview YouTube service for searching videos.
 * - searchYouTube - A function that searches YouTube for videos based on a query.
 */

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

interface YouTubeVideo {
    title: string;
    thumbnail: string;
    link: string;
}

export async function searchYouTube(query: string): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    console.warn('YouTube API key is not set. Returning empty array.');
    return [];
  }

  const url = `${YOUTUBE_API_URL}?part=snippet&q=${encodeURIComponent(
    query
  )}&key=${YOUTUBE_API_KEY}&type=video&maxResults=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      throw new Error(`YouTube API request failed: ${errorData.error.message}`);
    }
    
    const data = await response.json();

    return data.items.map((item: any) => ({
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

  } catch (error) {
    console.error('Error searching YouTube:', error);
    throw new Error('Failed to fetch videos from YouTube.');
  }
}
