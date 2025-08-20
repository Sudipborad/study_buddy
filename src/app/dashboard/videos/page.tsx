import { VideoRecommender } from "@/components/dashboard/video-recommender";

export default function VideosPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Video Recommender</h1>
                <p className="text-muted-foreground">
                    Expand your knowledge with AI-curated video content.
                </p>
            </div>
            <VideoRecommender />
        </div>
    )
}
