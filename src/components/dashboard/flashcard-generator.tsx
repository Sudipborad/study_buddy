'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { FlippableCard } from './flippable-card';
import { type Flashcard } from '@/lib/types';
import { generateFlashcards } from '@/ai/flows/generate-flashcards';

const formSchema = z.object({
  studyMaterial: z
    .string()
    .min(50, { message: 'Please provide at least 50 characters of study material.' })
    .max(5000, { message: 'Study material cannot exceed 5000 characters.' }),
});

export function FlashcardGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyMaterial: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFlashcards([]);
    try {
      const result = await generateFlashcards(values);
      if (result.flashcards && result.flashcards.length > 0) {
        setFlashcards(result.flashcards);
        toast({
          title: 'Success!',
          description: `Generated ${result.flashcards.length} flashcards.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'No flashcards generated.',
          description: 'The AI could not generate flashcards from the provided material. Please try again with different text.',
        });
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate flashcards. Please try again later.',
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
                name="studyMaterial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Study Material</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your notes, an article, or any text here..."
                        className="min-h-[200px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide the text you want to turn into flashcards.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Flashcards
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
            <p className="mt-4 text-muted-foreground">The AI is thinking... this may take a moment.</p>
        </div>
      )}

      {flashcards.length > 0 && (
        <Carousel className="w-full" opts={{ align: 'start', loop: true }}>
          <CarouselContent>
            {flashcards.map((card, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <FlippableCard frontContent={card.front} backContent={card.back} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12"/>
          <CarouselNext className="mr-12"/>
        </Carousel>
      )}

      {!isLoading && flashcards.length === 0 && (
        <Card className="text-center p-10 bg-secondary/50 border-dashed">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold font-headline">Your Flashcards Will Appear Here</h3>
            <p className="text-muted-foreground mt-2">Enter some study material above to get started.</p>
        </Card>
      )}
    </div>
  );
}
