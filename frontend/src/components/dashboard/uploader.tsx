"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StudyMaterialContext } from "@/contexts/study-material-context";
import { Label } from "@/components/ui/label";

// Import client-side PDF parsing
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// Optimized client-side PDF processing function
async function processPDFClientSide(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
    // Optimize for speed
    disableFontFace: true,
    disableAutoFetch: true,
    disableStream: true,
  }).promise;

  let fullText = "";
  const maxPages = Math.min(pdf.numPages, 50); // Limit to 50 pages for performance

  // Process pages in batches of 5 for better performance
  for (let i = 1; i <= maxPages; i += 5) {
    const batchPromises = [];
    const batchEnd = Math.min(i + 4, maxPages);

    for (let j = i; j <= batchEnd; j++) {
      batchPromises.push(
        pdf.getPage(j).then(async (page) => {
          const textContent = await page.getTextContent();
          return textContent.items
            .filter((item: any) => item.str && item.str.trim())
            .map((item: any) => item.str)
            .join(" ");
        })
      );
    }

    const batchResults = await Promise.all(batchPromises);
    fullText += batchResults.join(" ") + " ";
  }

  if (pdf.numPages > 50) {
    fullText += `\n\n[Note: Only first 50 pages processed for performance. Total pages: ${pdf.numPages}]`;
  }

  return fullText.trim();
}

export function Uploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const {
    setStudyMaterial,
    setDocumentTitle,
    setSummary,
    setFlashcards,
    setIsSaved,
  } = useContext(StudyMaterialContext);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileContent(null);
    setFileName("");
    setStudyMaterial(null);
    setDocumentTitle(null);
    setSummary(null);
    setFlashcards([]);
    setIsSaved(false);

    if (file.size > 25 * 1024 * 1024) {
      // 25MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 25MB.",
      });
      setIsUploading(false);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a .pdf, .docx, or .txt file.",
      });
      setIsUploading(false);
      return;
    }

    let text = "";

    try {
      // Process file client-side to avoid server limits
      if (file.type === "text/plain") {
        text = await file.text();
      } else if (file.type === "application/pdf") {
        text = await processPDFClientSide(file);
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        // For Word docs, we still need server processing for now
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "File processing failed.");
        }

        const data = await response.json();
        text = data.text;
      } else {
        throw new Error(
          "Unsupported file type. Please upload a PDF, DOCX, or TXT file."
        );
      }

      if (!text || text.trim().length < 100) {
        toast({
          variant: "destructive",
          title: "Not a valid document",
          description:
            "This document does not contain enough text to be used as study material. Please upload a different file.",
          duration: 5000,
        });
        setIsUploading(false);
        return;
      }

      // Optimize text length for faster AI processing
      const truncatedText = text.slice(0, 8000); // Reduced from 10000 for faster processing
      setFileContent(truncatedText);
      setFileName(file.name);
      setStudyMaterial(truncatedText);
      setDocumentTitle(file.name);
      toast({
        title: "File Processed",
        description:
          "Your document has been loaded. You can now use the AI tools.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProceed = () => {
    router.push("/dashboard/summary");
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed bg-secondary/50">
        <CardContent className="p-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <UploadCloud className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold font-headline">
              Click to upload or drag and drop
            </h3>
            <p className="text-sm text-muted-foreground">
              PDF, DOCX or TXT (up to 25MB)
            </p>
            <Input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              disabled={isUploading}
            />
            <Button asChild disabled={isUploading} size="lg">
              <Label htmlFor="file-upload" className="cursor-pointer">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing file...
                  </>
                ) : (
                  "Select File"
                )}
              </Label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {fileContent && (
        <Card>
          <CardHeader>
            <CardTitle>File Ready</CardTitle>
            <CardDescription>
              Your document{" "}
              <span className="font-bold text-primary">{fileName}</span> has
              been processed. Proceed to the summary page to begin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={handleProceed}>
              Go to Summary <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
