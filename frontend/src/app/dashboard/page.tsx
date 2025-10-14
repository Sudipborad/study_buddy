
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Video, ArrowRight, FileUp, HelpCircle, Newspaper, MessageCircle, Briefcase, Sparkles, BookMarked } from 'lucide-react';

const modules = [
   {
    title: 'Upload Material',
    description: 'Upload your study material to get started.',
    href: '/dashboard/upload',
    icon: <FileUp className="h-8 w-8 text-primary" />,
  },
  {
    title: 'My Materials',
    description: 'View and manage your saved documents.',
    href: '/dashboard/materials',
    icon: <BookMarked className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Summarizer',
    description: 'Get a concise summary of your document.',
    href: '/dashboard/summary',
    icon: <Newspaper className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Flashcard Generator',
    description: 'Create flashcards from your study materials.',
    href: '/dashboard/flashcards',
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Quiz Generator',
    description: 'Test your knowledge with an AI-generated quiz.',
    href: '/dashboard/quiz',
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Document Chatbot',
    description: 'Ask questions about your uploaded document.',
    href: '/dashboard/chatbot',
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Video Recommender',
    description: 'Get video recommendations based on topics.',
    href: '/dashboard/videos',
    icon: <Video className="h-8 w-8 text-primary" />,
  },
  {
    title: 'CV/Resume Maker',
    description: 'Create a professional resume with our builder.',
    href: '/dashboard/cv-maker',
    icon: <Briefcase className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Interview Prep',
    description: 'Practice with AI-generated interview questions.',
    href: '/dashboard/interview-prep',
    icon: <Sparkles className="h-8 w-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Your central hub for smarter learning. Select a tool to get started.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.title} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                {module.icon}
                <div className="flex-1">
                  <CardTitle className="font-headline text-xl">{module.title}</CardTitle>
                  <CardDescription className="pt-2">{module.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={module.href}>
                  Go to Module <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
