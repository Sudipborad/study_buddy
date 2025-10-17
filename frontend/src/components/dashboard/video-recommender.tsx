"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Wand2, Film, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type VideoRecommendation } from "@/lib/types";
import { recommendVideos } from "@/ai/flows/recommend-videos";
import { StudyMaterialContext } from "@/contexts/study-material-context";

export function VideoRecommender() {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VideoRecommendation[]>([]);
  const { studyMaterial } = useContext(StudyMaterialContext);
  const { toast } = useToast();

  const handleRecommend = async () => {
    if (!studyMaterial) {
      toast({
        variant: "destructive",
        title: "No study material found.",
        description: "Please upload study material first.",
      });
      return;
    }

    console.log("Starting video recommendation process...");
    setIsLoading(true);
    setVideos([]);

    try {
      console.log(
        "Calling recommendVideos with material length:",
        studyMaterial.length
      );
      const result = await recommendVideos({ documentSummary: studyMaterial });
      console.log("Video recommendation result:", result);

      if (result && result.length > 0) {
        setVideos(result);
        toast({
          title: "Success!",
          description: `Found ${result.length} video recommendation${
            result.length > 1 ? "s" : ""
          }.`,
        });
      } else {
        console.warn("No videos returned from recommendation service");
        toast({
          title: "No videos found.",
          description:
            "Could not find relevant videos for your material. The service may be experiencing issues.",
          variant: "default",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error recommending videos:", error);

      toast({
        variant: "destructive",
        title: "Video Recommendation Failed",
        description: errorMessage.includes("503")
          ? "AI service is temporarily overloaded. Please try again in a moment."
          : "Failed to get video recommendations. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studyMaterial) {
      handleRecommend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyMaterial]);

  return (
    <div className="space-y-8">
      {isLoading && (
        <div className="text-center p-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Searching for relevant videos...
          </p>
        </div>
      )}

      {videos.length > 0 && !isLoading && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Recommended Videos</CardTitle>
              <CardDescription>
                Here are some videos based on your study material.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <Card
                  key={index}
                  className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="p-0">
                    <Link
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-video"
                    >
                      <Image
                        src={
                          video.thumbnail ||
                          "https://placehold.co/480x360/3b82f6/ffffff?text=Educational+Video"
                        }
                        alt={video.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://placehold.co/480x360/16a34a/ffffff?text=Verified+Educational+Content";
                        }}
                        unoptimized
                      />
                    </Link>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <CardTitle className="font-headline text-lg line-clamp-2">
                      {video.title}
                    </CardTitle>
                    {video.link.includes("/results?search_query=") && (
                      <p className="text-sm text-muted-foreground mt-2">
                        🔍 Curated educational search results
                      </p>
                    )}
                    {video.link.includes("/watch?v=") && (
                      <p className="text-sm text-green-600 mt-2">
                        ✅ Verified working video
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild variant="outline" className="w-full">
                      <Link
                        href={video.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          console.log(
                            "Opening verified video:",
                            video.title,
                            video.link
                          );
                          // Track analytics if needed
                        }}
                      >
                        {video.link.includes("/results?search_query=") ? (
                          <>
                            Browse Videos{" "}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Watch Video{" "}
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </CardContent>
          </Card>
          <div className="text-center">
            <Button onClick={handleRecommend} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Find Again
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {!isLoading && videos.length === 0 && (
        <Card className="text-center p-10 bg-secondary/50 border-dashed">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Film className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold font-headline">
            Video Recommendations Will Appear Here
          </h3>
          <p className="text-muted-foreground mt-2">
            {studyMaterial
              ? "Generating video recommendations from your uploaded material..."
              : "Upload study material to get personalized video recommendations."}
          </p>
          {studyMaterial && (
            <div className="mt-4">
              <Button onClick={handleRecommend} variant="outline">
                <Wand2 className="mr-2 h-4 w-4" />
                Try Getting Videos
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
