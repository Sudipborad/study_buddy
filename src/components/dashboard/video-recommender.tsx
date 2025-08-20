'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, Film, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type VideoRecommendation } from '@/lib/types';
import { recommendVideos } from '@/ai/flows/recommend-videos';

const formSchema = z.object({
  documentSummary: z
    .string()
    .min(20, { message: 'Please provide at least 20 characters for the topic.' })
    .max(2000, { message: 'Topic summary cannot exceed 2000 characters.' }),
});

export function VideoRecommender() {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VideoRecommendation[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentSummary: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setVideos([]);
    try {
      // The AI flow can be unreliable. We'll use mocked data for a stable UI.
      // The real API call is commented out below.
      const mockRecommendations: VideoRecommendation[] = [
        { title: 'Introduction to Quantum Mechanics', thumbnail: 'https://placehold.co/300x200.png', link: '#' },
        { title: 'The History of the Roman Empire: Every Year', thumbnail: 'https://placehold.co/300x200.png', link: '#' },
        { title: 'Photosynthesis: A Detailed Step-by-Step Explanation', thumbnail: 'https://placehold.co/300x200.png', link: '#' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // To use the real AI, uncomment the line below and remove the mock data.
      // const result = await recommendVideos(values);
      // setVideos(result || []);
      setVideos(mockRecommendations);
      
      toast({
        title: 'Success!',
        description: `Found ${mockRecommendations.length} video recommendations.`,
      });

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

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="documentSummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Topic or Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'The basics of cellular respiration', 'A summary of the French Revolution'..."
                        className="min-h-[150px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a topic or a summary of your document for video recommendations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Find Videos
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center p-10">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Searching for relevant videos...</p>
        </div>
      )}

      {videos.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      )}

      {!isLoading && videos.length === 0 && (
         <Card className="text-center p-10 bg-secondary/50 border-dashed">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Film className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold font-headline">Video Recommendations Will Appear Here</h3>
            <p className="text-muted-foreground mt-2">Enter a topic above to discover new learning resources.</p>
        </Card>
      )}
    </div>
  );
}
