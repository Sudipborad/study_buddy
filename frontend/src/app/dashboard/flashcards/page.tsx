'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudyMaterialContext } from '@/contexts/study-material-context';
import { FlashcardGenerator } from "@/components/dashboard/flashcard-generator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import Link from 'next/link';

export default function FlashcardsPage() {
    const { studyMaterial } = useContext(StudyMaterialContext);
    const router = useRouter();

    useEffect(() => {
        if (!studyMaterial) {
            router.push('/dashboard/upload');
        }
    }, [studyMaterial, router]);

    if (!studyMaterial) {
        return (
             <Card className="w-full max-w-lg mx-auto mt-10 text-center">
                <CardHeader>
                    <CardTitle className="font-headline">No Study Material Found</CardTitle>
                    <CardDescription>
                        Please upload your study material first to generate flashcards.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/upload">
                            <FileUp className="mr-2" />
                            Upload Material
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Flashcard Generator</h1>
                <p className="text-muted-foreground">
                    Let AI create your study sets instantly from your uploaded material.
                </p>
            </div>
            <FlashcardGenerator />
        </div>
    )
}
