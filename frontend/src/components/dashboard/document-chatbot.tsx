'use client';

import { useState, useContext, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, User, Bot, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatWithDocument } from '@/ai/flows/chat-with-document';
import { StudyMaterialContext } from '@/contexts/study-material-context';
import { ScrollArea } from '../ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function DocumentChatbot() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { studyMaterial } = useContext(StudyMaterialContext);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom.
        setTimeout(() => {
             if (scrollAreaRef.current) {
                const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (viewport) {
                    viewport.scrollTop = viewport.scrollHeight;
                }
             }
        }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !studyMaterial) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatWithDocument({ documentText: studyMaterial, question: input });
      if (result.answer) {
        const assistantMessage: Message = { role: 'assistant', content: result.answer };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast({
          variant: 'destructive',
          title: 'No answer found.',
          description: 'The AI could not find an answer in the document.',
        });
      }
    } catch (error) {
      console.error('Error chatting with document:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to get an answer. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast({
        title: "Chat Cleared",
        description: "The conversation has been cleared.",
    });
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Chat with your Document</CardTitle>
        <CardDescription>Ask any question about the content of your uploaded file.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
                 <div className="text-center text-muted-foreground p-8">
                    <Bot className="mx-auto h-12 w-12 mb-4" />
                    <p>No messages yet. Start the conversation by asking a question below.</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Bot className="h-6 w-6" />
                  </div>
                )}
                <div className={`rounded-lg p-3 max-w-[80%] ${message.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'}`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <div className="bg-accent text-accent-foreground rounded-full p-2">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div className="rounded-lg p-3 bg-muted">
                       <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
             )}
          </div>
        </ScrollArea>
        <div className="mt-4 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Type your question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
          <Button onClick={handleClearChat} variant="outline" disabled={isLoading || messages.length === 0}>
             <Wand2 className="mr-2 h-4 w-4" />
             Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
