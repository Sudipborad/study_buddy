"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getMaterials, deleteMaterial } from "@/lib/firebase/firestore";
import { StudyMaterialContext } from "@/contexts/study-material-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, BookOpen, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { type Flashcard } from "@/lib/types";

interface Material {
  id: string;
  title: string;
  summary: string;
  flashcards: Flashcard[];
  createdAt: string;
}

export default function MaterialsPage() {
  const { user } = useAuth();
  const {
    setSummary,
    setFlashcards,
    setDocumentTitle,
    setStudyMaterial,
    setIsSaved,
  } = useContext(StudyMaterialContext);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMaterials();
    } else {
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const fetchMaterials = async () => {
    if (!user) {
      console.log("No user found");
      return;
    }
    console.log("Fetching materials for user:", user.id);
    setIsLoading(true);
    try {
      const userMaterials = await getMaterials(user.id);
      console.log("Fetched materials:", userMaterials);
      setMaterials(userMaterials as Material[]);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch materials. Check console for details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMaterial = (material: Material) => {
    console.log("Loading material:", material.title);

    // Store in localStorage for persistence
    localStorage.setItem(
      "loadedMaterial",
      JSON.stringify({
        title: material.title,
        summary: material.summary,
        flashcards: material.flashcards,
        isSaved: true,
      })
    );

    setDocumentTitle(material.title);
    setSummary({ summary: material.summary });
    setFlashcards(material.flashcards);
    setIsSaved(true);
    setStudyMaterial("LOADED_FROM_MATERIALS");

    toast({
      title: "Study Set Loaded",
      description: "The summary and flashcards are now active.",
      duration: 2000,
    });

    router.push("/dashboard/summary");
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!user) return;
    try {
      await deleteMaterial(user.id, materialId);
      setMaterials(materials.filter((m) => m.id !== materialId));
      toast({
        title: "Success",
        description: "Study set deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete study set.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Materials</h1>
        <p className="text-muted-foreground">
          Here are all your saved study sets. Load one to review the summary and
          flashcards.
        </p>
      </div>

      {materials.length === 0 ? (
        <Card className="text-center p-10 bg-secondary/50 border-dashed">
          <CardHeader>
            <CardTitle className="font-headline">No Materials Found</CardTitle>
            <CardDescription>
              You haven't saved any study sets yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/upload">
                <PlusCircle className="mr-2" />
                Upload a Document to Start
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <Card key={material.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline truncate">
                  {material.title}
                </CardTitle>
                <CardDescription>Saved on {material.createdAt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {material.summary}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleLoadMaterial(material)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Load
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteMaterial(material.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
