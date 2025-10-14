'use client';

import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, Film, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type VideoRecommendation } from '@/lib/types';
import { recommendVideos } from '@/ai/flows/recommend-videos';
import { StudyMaterialContext } from '@/contexts/study-material-context';

export function VideoRecommender() {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VideoRecommendation[]>([]);
  const { studyMaterial } = useContext(StudyMaterialContext);
  const { toast } = useToast();

  const handleRecommend = async () => {
     if (!studyMaterial) {
      toast({
        variant: 'destructive',
        title: 'No study material found.',
        description: 'Please upload study material first.',
      });
      return;
    }
    setIsLoading(true);
    setVideos([]);
    try {
      const result = await recommendVideos({ documentSummary: studyMaterial });
      setVideos(result || []);

      if (result && result.length > 0) {
        toast({
          title: 'Success!',
          description: `Found ${result.length} video recommendations.`,
        });
      } else {
         toast({
          variant: 'destructive',
          title: 'No videos found.',
          description: 'Could not find any relevant videos. Try with different material.',
        });
      }

    } catch (error) {
      console.error('Error recommending videos:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to recommend videos. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (studyMaterial) {
      handleRecommend();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyMaterial]);


  return (
    <div className="space-y-8">
      {isLoading && (
        <div className="text-center p-10">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Searching for relevant videos...</p>
        </div>
      )}

      {videos.length > 0 && !isLoading && (
        <>
        <Card>
          <CardHeader>
              <CardTitle>Recommended Videos</CardTitle>
              <CardDescription>Here are some videos based on your study material.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card key={index} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <Link href={video.link} target="_blank" rel="noopener noreferrer" className="block relative aspect-video">
                    <Image src={video.thumbnail || "https://placehold.co/300x200.png"} alt={video.title} layout="fill" objectFit="cover" data-ai-hint="youtube thumbnail" />
                  </Link>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="font-headline text-lg line-clamp-2">{video.title}</CardTitle>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="outline" className="w-full">
                      <Link href={video.link} target="_blank" rel="noopener noreferrer">
                          Watch on YouTube <ExternalLink className="ml-2 h-4 w-4"/>
                      </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>
        <div className='text-center'>
            <Button onClick={handleRecommend} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Find Again
                  </>
                )}
              </Button>
          </div>
        </>
      )}

      {!isLoading && videos.length === 0 && (
         <Card className="text-center p-10 bg-secondary/50 border-dashed">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Film className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold font-headline">Video Recommendations Will Appear Here</h3>
            <p className="text-muted-foreground mt-2">Generating recommendations from your uploaded material.</p>
        </Card>
      )}
    </div>
  );
}
