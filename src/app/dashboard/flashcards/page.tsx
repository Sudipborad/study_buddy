import { FlashcardGenerator } from "@/components/dashboard/flashcard-generator";

export default function FlashcardsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Flashcard Generator</h1>
                <p className="text-muted-foreground">
                    Let AI create your study sets instantly.
                </p>
            </div>
            <FlashcardGenerator />
        </div>
    )
}
