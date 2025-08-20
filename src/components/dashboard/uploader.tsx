'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StudyMaterialContext } from '@/contexts/study-material-context';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  studyMaterial: z
    .string()
    .min(50, { message: 'Please provide at least 50 characters of study material.' })
    .max(10000, { message: 'Study material cannot exceed 10,000 characters.' }),
  file: z.any().optional(),
});

export function Uploader() {
  const [isLoading, setIsLoading] = useState(false);
  const { setStudyMaterial } = useContext(StudyMaterialContext);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyMaterial: '',
      file: null,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: 'destructive', title: 'File too large', description: 'Please upload a file smaller than 5MB.' });
        return;
      }
      if (file.type !== 'text/plain') {
         toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please upload a plain text (.txt) file.' });
         return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        form.setValue('studyMaterial', text.slice(0, 10000));
        handleSubmit({ studyMaterial: text.slice(0, 10000), file: null });
      };
      reader.readAsText(file);
    }
  };

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));
    setStudyMaterial(values.studyMaterial);
    toast({
      title: 'Success!',
      description: 'Your study material has been loaded. Redirecting you to the flashcard generator...',
    });
    router.push('/dashboard/flashcards');
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Provide Your Material</CardTitle>
        <CardDescription>Use one of the methods below. The content will be used to power the AI features.</CardDescription>
      </CardHeader>
      <CardContent>
         <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paste">Paste Text</TabsTrigger>
                <TabsTrigger value="upload">Upload .txt File</TabsTrigger>
            </TabsList>
            <TabsContent value="paste">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
                    <FormField
                        control={form.control}
                        name="studyMaterial"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg font-semibold">Paste Your Text</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="Paste your notes, an article, or any text here..."
                                className="min-h-[250px] text-base"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                        ) : (
                        <>
                           <UploadCloud className="mr-2 h-4 w-4" />
                            Use This Text
                        </>
                        )}
                    </Button>
                    </form>
                </Form>
            </TabsContent>
            <TabsContent value="upload">
                <Card className="border-2 border-dashed bg-secondary/50 mt-4">
                     <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                             <UploadCloud className="h-12 w-12 text-muted-foreground" />
                             <h3 className="text-lg font-semibold">Click to upload or drag and drop</h3>
                             <p className="text-sm text-muted-foreground">Plain text file (.txt), up to 5MB</p>
                             <FormControl>
                                <Input type="file" className="hidden" id="file-upload" onChange={handleFileChange} accept=".txt" />
                             </FormControl>
                              <Button asChild>
                                <Label htmlFor="file-upload" className="cursor-pointer">
                                   Select File
                                </Label>
                             </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
