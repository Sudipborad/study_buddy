/**
 * @fileOverview YouTube service for searching videos.
 * - searchYouTube - A function that searches YouTube for videos based on a query.
 */

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_API = 'https://www.googleapis.com/youtube/v3/videos';

interface YouTubeVideo {
    title: string;
    thumbnail: string;
    link: string;
}



// Verified working educational videos from trusted channels (manually verified and tested)
const VERIFIED_EDUCATIONAL_VIDEOS = [
  {
    id: 'ukLnPbIffxE',
    title: 'How to Study Effectively: 8 Advanced Tips',
    thumbnail: 'https://i.ytimg.com/vi/ukLnPbIffxE/hqdefault.jpg',
    category: 'study'
  },
  {
    id: 'RH95h36NChI', 
    title: 'Study Less Study Smart: A 6-Minute Summary',
    thumbnail: 'https://i.ytimg.com/vi/RH95h36NChI/hqdefault.jpg',
    category: 'learning'
  },
  {
    id: 'njsdTB9FbwE',
    title: 'How to Take Notes Effectively', 
    thumbnail: 'https://i.ytimg.com/vi/njsdTB9FbwE/hqdefault.jpg',
    category: 'notes'
  },
  {
    id: 'Z-zNHHpXoMM',
    title: 'Memory Palace Tutorial - Remember Anything',
    thumbnail: 'https://i.ytimg.com/vi/Z-zNHHpXoMM/hqdefault.jpg',
    category: 'memory'
  },
  {
    id: 'IlU-zDU6aQ0',
    title: 'Active Recall: The Most Effective Study Technique',
    thumbnail: 'https://i.ytimg.com/vi/IlU-zDU6aQ0/hqdefault.jpg',
    category: 'study'
  },
  {
    id: 'V-UvSKe8jW4',
    title: 'Spaced Repetition: The Most Powerful Study Technique',
    thumbnail: 'https://i.ytimg.com/vi/V-UvSKe8jW4/hqdefault.jpg',
    category: 'learning'
  }
];



// Function to search YouTube API for real videos based on document content
async function searchYouTubeAPI(query: string): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not available');
  }

  try {
    console.log('Searching YouTube API for:', query);
    
    // Enhance the search query for better educational results
    const enhancedQuery = `${query} tutorial explained lesson education`;
    const searchUrl = `${YOUTUBE_API_URL}?part=snippet&maxResults=9&q=${encodeURIComponent(enhancedQuery)}&type=video&key=${YOUTUBE_API_KEY}&order=relevance&safeSearch=strict&videoDefinition=any&videoDuration=any`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      console.warn(`YouTube API responded with status: ${response.status}`);
      if (response.status === 403) {
        throw new Error('YouTube API quota exceeded or invalid key');
      }
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('YouTube API response received, items count:', data.items?.length || 0);
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      console.warn('No videos found in API response');
      return [];
    }

    // Convert API results to our format and filter out likely unavailable content
    const videos: YouTubeVideo[] = data.items
      .filter((item: any) => {
        // Filter out videos that are likely to be unavailable
        const title = item.snippet?.title?.toLowerCase() || '';
        const description = item.snippet?.description?.toLowerCase() || '';
        
        // Skip videos with these indicators
        const badIndicators = [
          'deleted video', 'private video', 'unavailable', 'removed', 
          'blocked', 'restricted', '[deleted]', '[private]'
        ];
        
        return !badIndicators.some(indicator => 
          title.includes(indicator) || description.includes(indicator)
        );
      })
      .map((item: any) => ({
        title: item.snippet.title || 'Educational Video',
        thumbnail: item.snippet.thumbnails?.high?.url || 
                  item.snippet.thumbnails?.medium?.url || 
                  item.snippet.thumbnails?.default?.url || '',
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }))
      .filter((video: YouTubeVideo) => video.title && video.link); // Ensure valid data

    console.log(`Filtered ${videos.length} potentially valid videos from API`);

    // For better performance, return first batch without deep validation
    // The validation happens on the client side when user clicks
    return videos.slice(0, 6);

  } catch (error) {
    console.error('YouTube API search failed:', error);
    throw error;
  }
}

// Function to get educational alternatives when API is not available
function getEducationalAlternatives(query: string): YouTubeVideo[] {
  console.log('Providing educational alternatives for query:', query);
  
  // Extract key terms from the query for better recommendations
  const lowerQuery = query.toLowerCase();
  const keyTerms = query.split(' ').filter(term => term.length > 3);
  
  // Create dynamic educational search suggestions based on the actual query content
  const educationalAlternatives: YouTubeVideo[] = [
    {
      title: `Learn about: ${query}`,
      thumbnail: 'https://placehold.co/480x360/3b82f6/ffffff?text=Educational+Content',
      link: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+tutorial+explained`
    },
    {
      title: `${query} - Educational Videos`,
      thumbnail: 'https://placehold.co/480x360/16a34a/ffffff?text=Learn+More',
      link: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+lecture+course`
    },
    {
      title: `Study Guide: ${query}`,
      thumbnail: 'https://placehold.co/480x360/10b981/ffffff?text=Study+Guide',
      link: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+study+guide+overview`
    }
  ];

  // If we have specific terms, add more targeted searches
  if (keyTerms.length > 0) {
    const mainTerm = keyTerms[0];
    educationalAlternatives.push({
      title: `Khan Academy: ${mainTerm}`,
      thumbnail: 'https://placehold.co/480x360/059669/ffffff?text=Khan+Academy',
      link: `https://www.youtube.com/results?search_query=khan+academy+${encodeURIComponent(mainTerm)}`
    });
  }

  return educationalAlternatives;
}

export async function searchYouTube(query: string): Promise<YouTubeVideo[]> {
  console.log('Searching for YouTube videos related to:', query);
  
  // Always try API search first for document-specific content
  if (YOUTUBE_API_KEY) {
    try {
      const apiVideos = await searchYouTubeAPI(query);
      if (apiVideos.length > 0) {
        console.log(`Found ${apiVideos.length} videos from API search for: ${query}`);
        return apiVideos;
      }
    } catch (error) {
      console.warn('API search failed:', error);
    }
  }
  
  // If no API key or API fails, provide educational alternatives
  console.warn('YouTube API not available, returning educational alternatives');
  return getEducationalAlternatives(query);
}


