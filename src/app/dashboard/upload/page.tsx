import { Uploader } from "@/components/dashboard/uploader";

export default function UploadPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Upload Study Material</h1>
                <p className="text-muted-foreground">
                    Upload a file or paste text to generate flashcards, quizzes, and video recommendations.
                </p>
            </div>
            <Uploader />
        </div>
    )
}
