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
import { type DocumentSummary } from "@/lib/types";
import { summarizeDocument } from "@/ai/flows/summarize-document";
import { generateFlashcards } from "@/ai/flows/generate-flashcards";
import { StudyMaterialContext } from "@/contexts/study-material-context";
import { ScrollArea } from "../ui/scroll-area";
import { addMaterial } from "@/lib/firebase/firestore";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function DocumentSummarizer() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {
    studyMaterial,
    summary,
    setSummary,
    setFlashcards,
    documentTitle,
    flashcards,
    isSaved,
    setIsSaved,
  } = useContext(StudyMaterialContext);

  // Debug logging
  console.log("DocumentSummarizer - Current context state:", {
    studyMaterial: studyMaterial ? "has material" : "null",
    summary: summary ? "has summary" : "null",
    documentTitle,
    flashcardsCount: flashcards.length,
    isSaved,
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const handleGenerate = async (material: string) => {
    if (!material) {
      toast({
        variant: "destructive",
        title: "No study material found.",
        description: "Please upload study material first.",
      });
      return;
    }
    setIsGenerating(true);
    setSummary(null);
    setFlashcards([]);
    setIsSaved(false);
    try {
      // Run summary and flashcards in parallel for better performance
      const [summaryResult, flashcardResult] = await Promise.allSettled([
        summarizeDocument({ documentText: material }),
        generateFlashcards({ studyMaterial: material }),
      ]);

      // Handle summary result
      if (summaryResult.status === "fulfilled" && summaryResult.value.summary) {
        setSummary(summaryResult.value);
        toast({
          title: "Success!",
          description: "Generated document summary.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Summary generation failed.",
          description: "Could not generate summary. Please try again.",
        });
      }

      // Handle flashcards result
      if (
        flashcardResult.status === "fulfilled" &&
        flashcardResult.value.flashcards &&
        flashcardResult.value.flashcards.length > 0
      ) {
        setFlashcards(flashcardResult.value.flashcards);
        toast({
          title: "Flashcards Ready!",
          description: `Generated ${flashcardResult.value.flashcards.length} flashcards.`,
        });
      }

      // If both failed, show error
      if (
        summaryResult.status === "rejected" &&
        flashcardResult.status === "rejected"
      ) {
        toast({
          variant: "destructive",
          title: "AI processing failed.",
          description:
            "Both summary and flashcard generation failed. Please try again.",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Error generating content:", error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: `Failed to generate content: ${errorMessage}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user || !documentTitle || !summary || flashcards.length === 0) {
      toast({
        variant: "destructive",
        title: "Cannot Save Study Set",
        description:
          "Ensure a summary and flashcards have been generated before saving.",
      });
      return;
    }
    setIsSaving(true);
    try {
      await addMaterial(user.id, {
        title: documentTitle,
        summary: summary.summary,
        flashcards: flashcards,
      });
      setIsSaved(true);
      toast({
        title: "Study Set Saved!",
        description:
          "Your summary and flashcards have been saved to My Materials. You can continue working with this content.",
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
    if (studyMaterial && !summary) {
      handleGenerate(studyMaterial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyMaterial]);

  return (
    <div className="space-y-8">
      {isGenerating && (
        <Card className="text-center p-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            The AI is summarizing and creating flashcards... this may take a
            moment.
          </p>
        </Card>
      )}

      {summary && !isGenerating && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Summary</CardTitle>
                  <CardDescription>
                    This is a concise overview of your document. Flashcards have
                    also been generated.
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
              <ScrollArea className="h-96 w-full rounded-md border p-4">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {summary.summary}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="text-center flex items-center justify-center gap-4">
            {studyMaterial && (
              <Button
                onClick={() => handleGenerate(studyMaterial)}
                disabled={isGenerating || isSaving}
              >
                {isGenerating ? (
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
            )}
            <Button
              onClick={handleSave}
              disabled={
                isGenerating || isSaving || flashcards.length === 0 || isSaved
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

      {!isGenerating && !summary && (
        <Card className="text-center p-10 bg-secondary/50 border-dashed">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold font-headline">
            Your Summary Will Appear Here
          </h3>
          <p className="text-muted-foreground mt-2">
            Generating a summary from your uploaded material.
          </p>
          {/* Debug info */}
          <div className="mt-4 p-2 bg-gray-100 text-xs text-left">
            <strong>Debug Info:</strong>
            <br />
            Document Title: {documentTitle || "null"}
            <br />
            Summary: {summary ? "exists" : "null"}
            <br />
            Flashcards: {flashcards.length}
            <br />
            Is Saved: {isSaved ? "true" : "false"}
            <br />
            Study Material: {studyMaterial ? "exists" : "null"}
          </div>
        </Card>
      )}
    </div>
  );
}
