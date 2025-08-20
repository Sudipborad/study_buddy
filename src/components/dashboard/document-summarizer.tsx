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
import { type DocumentSummary } from '@/lib/types';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { StudyMaterialContext } from '@/contexts/study-material-context';
import { ScrollArea } from '../ui/scroll-area';

export function DocumentSummarizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
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
    setSummary(null);
    try {
      const result = await summarizeDocument({ documentText: studyMaterial });
      if (result.summary) {
        setSummary(result);
        toast({
          title: 'Success!',
          description: 'Generated document summary.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'No summary generated.',
          description: 'The AI could not generate a summary from the provided material. Please try again with different text.',
        });
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate summary. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
          <p className="mt-4 text-muted-foreground">The AI is summarizing your document... this may take a moment.</p>
        </div>
      )}

      {summary && !isLoading && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Generated Summary</CardTitle>
              <CardDescription>This is a concise overview of your document.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                     <div className="whitespace-pre-wrap leading-relaxed">
                        {summary.summary}
                    </div>
                </ScrollArea>
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

      {!isLoading && !summary && (
        <Card className="text-center p-10 bg-secondary/50 border-dashed">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold font-headline">Your Summary Will Appear Here</h3>
          <p className="text-muted-foreground mt-2">Generating a summary from your uploaded material.</p>
        </Card>
      )}
    </div>
  );
}
