'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
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
  const [isUploading, setIsUploading] = useState(false);
  const { setStudyMaterial } = useContext(StudyMaterialContext);
  const router = useRouter();
  const { toast } = useToast();
  
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyMaterial: '',
      file: null,
    },
  });

  const saveAndRedirect = async (content: string) => {
    setStudyMaterial(content);
    toast({
      title: 'Success!',
      description: 'Your study material has been loaded. Redirecting...',
    });
    router.push('/dashboard/summary');
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ variant: 'destructive', title: 'File too large', description: 'Please upload a file smaller than 5MB.' });
      setIsUploading(false);
      return;
    }
    
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
       toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please upload a .txt, .pdf, or .docx file.' });
       setIsUploading(false);
       return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'File processing failed.');
        }

        const data = await response.json();
        const truncatedText = data.text.slice(0, 10000);
        await saveAndRedirect(truncatedText);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error('Error uploading file:', error);
        toast({ variant: 'destructive', title: 'Upload Error', description: errorMessage });
    } finally {
        setIsUploading(false);
    }
  };


  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await saveAndRedirect(values.studyMaterial);
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
                <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="paste">
                <FormProvider {...formMethods}>
                    <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
                    <FormField
                        control={formMethods.control}
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
                </FormProvider>
            </TabsContent>
            <TabsContent value="upload">
                <Card className="border-2 border-dashed bg-secondary/50 mt-4">
                     <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                             <UploadCloud className="h-12 w-12 text-muted-foreground" />
                             <h3 className="text-lg font-semibold">Click to upload or drag and drop</h3>
                             <p className="text-sm text-muted-foreground">TXT, PDF, or DOCX, up to 5MB</p>
                            <Input 
                                type="file" 
                                className="hidden" 
                                id="file-upload" 
                                onChange={handleFileChange} 
                                accept=".txt,.pdf,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                disabled={isUploading}
                            />
                            <Button asChild disabled={isUploading}>
                              <Label htmlFor="file-upload" className="cursor-pointer">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : 'Select File'
                                }
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
