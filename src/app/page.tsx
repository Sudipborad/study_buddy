import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import { BrainCircuit, Video, BookCopy } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline">Study Smarter</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Supercharge Your Learning with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Transform your study materials into interactive flashcards, get intelligent video recommendations, and conquer your exams. All in one place.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/register">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        <section className="bg-secondary/30 py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">How It Works</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                A simple, intuitive process to elevate your study sessions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                    <span className="font-headline">AI Flashcards</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Provide your study notes, and our AI will generate comprehensive flashcards to help you master key concepts.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Video className="h-8 w-8 text-primary" />
                    <span className="font-headline">Video Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Get curated video suggestions from YouTube to deepen your understanding of any topic.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BookCopy className="h-8 w-8 text-primary" />
                    <span className="font-headline">Manage Materials</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Keep all your study sets organized and accessible, ready for your next review session.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Distraction-Free Learning</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Our clean and minimalist interface is designed to help you focus on what matters most: learning. No clutter, no distractions, just pure knowledge.
              </p>
              <Button variant="outline" asChild>
                <Link href="/register">Explore the Interface</Link>
              </Button>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden shadow-2xl border">
              <Image src="https://placehold.co/600x400.png" alt="App Screenshot" layout="fill" objectFit="cover" data-ai-hint="app interface screenshot" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Study Smarter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
