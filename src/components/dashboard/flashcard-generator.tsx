'use client';

import { useState, useContext, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { StudyMaterialContext } from '@/contexts/study-material-context';

export function FlashcardGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const { studyMaterial } = useContext(StudyMaterialContext);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!studyMaterial) {
      toast({
        variant: 'destructive',
        title: 'No study material found.',
        description: 'Please upload study material first.',
      });
      return;
    }
    setIsLoading(true);
    setFlashcards([]);
    try {
      const result = await generateFlashcards({ studyMaterial });
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
  };

  useEffect(() => {
    // Automatically generate flashcards when component mounts with study material
    if (studyMaterial) {
      handleGenerate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyMaterial]);

  return (
    <div className="space-y-8">
      {isLoading && (
        <div className="text-center p-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">The AI is thinking... this may take a moment.</p>
        </div>
      )}

      {flashcards.length > 0 && !isLoading && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Generated Flashcards</CardTitle>
              <CardDescription>Click a card to flip it. Use the arrows to navigate.</CardDescription>
            </CardHeader>
            <CardContent>
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
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
              </Carousel>
            </CardContent>
          </Card>
          <div className='text-center'>
            <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Regenerate
                  </>
                )}
              </Button>
          </div>
        </>
      )}

      {!isLoading && flashcards.length === 0 && (
        <Card className="text-center p-10 bg-secondary/50 border-dashed">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold font-headline">Your Flashcards Will Appear Here</h3>
          <p className="text-muted-foreground mt-2">Generating flashcards from your uploaded material.</p>
        </Card>
      )}
    </div>
  );
}
