"use client";

import { useState, useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Wand2,
  Lightbulb,
  Save,
  CheckCircle,
  FolderOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FlippableCard } from "./flippable-card";
import { generateFlashcards } from "@/ai/flows/generate-flashcards";
import { StudyMaterialContext } from "@/contexts/study-material-context";
import { addMaterial } from "@/lib/firebase/firestore";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function FlashcardGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {
    studyMaterial,
    flashcards,
    setFlashcards,
    documentTitle,
    summary,
    isSaved,
    setIsSaved,
  } = useContext(StudyMaterialContext);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const handleGenerate = async () => {
    if (!studyMaterial) {
      toast({
        variant: "destructive",
        title: "No study material found.",
        description: "Please upload study material first.",
      });
      return;
    }
    setIsLoading(true);
    setFlashcards([]);
    setIsSaved(false);
    try {
      const result = await generateFlashcards({ studyMaterial });
      if (result.flashcards && result.flashcards.length > 0) {
        setFlashcards(result.flashcards);
        toast({
          title: "Success!",
          description: `Generated ${result.flashcards.length} flashcards.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "No flashcards generated.",
          description:
            "The AI could not generate flashcards from the provided material. Please try again with different text.",
        });
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to generate flashcards. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !documentTitle || !flashcards.length) {
      toast({
        variant: "destructive",
        title: "Cannot Save Study Set",
        description:
          "Ensure flashcards have been generated and you have a document title before saving.",
      });
      return;
    }
    setIsSaving(true);
    try {
      await addMaterial(user.uid, {
        title: documentTitle,
        summary: summary?.summary || "Flashcard study set without summary",
        flashcards: flashcards,
      });
      setIsSaved(true);
      toast({
        title: "Study Set Saved!",
        description:
          "Your flashcards have been saved to My Materials. You can continue working with this content.",
        duration: 4000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred saving your study set.";
      console.error("Error saving material:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Automatically generate flashcards if material exists but flashcards don't
    if (studyMaterial && flashcards.length === 0) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyMaterial]);

  return (
    <div className="space-y-8">
      {isLoading && (
        <div className="text-center p-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            The AI is thinking... this may take a moment.
          </p>
        </div>
      )}

      {flashcards.length > 0 && !isLoading && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Flashcards</CardTitle>
                  <CardDescription>
                    Click a card to flip it. Use the arrows to navigate.
                  </CardDescription>
                </div>
                {isSaved && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Saved
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Carousel
                className="w-full"
                opts={{ align: "start", loop: true }}
              >
                <CarouselContent>
                  {flashcards.map((card, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="p-1">
                        <FlippableCard
                          frontContent={card.front}
                          backContent={card.back}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
              </Carousel>
            </CardContent>
          </Card>
          <div className="text-center flex items-center justify-center gap-4">
            <Button onClick={handleGenerate} disabled={isLoading || isSaving}>
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
            <Button
              onClick={handleSave}
              disabled={
                isLoading || isSaving || flashcards.length === 0 || isSaved
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Study Set
                </>
              )}
            </Button>
            {isSaved && (
              <Button variant="outline" asChild>
                <Link href="/dashboard/materials">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  View My Materials
                </Link>
              </Button>
            )}
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
          <h3 className="text-xl font-semibold font-headline">
            Your Flashcards Will Appear Here
          </h3>
          <p className="text-muted-foreground mt-2">
            Generating flashcards from your uploaded material.
          </p>
        </Card>
      )}
    </div>
  );
}
