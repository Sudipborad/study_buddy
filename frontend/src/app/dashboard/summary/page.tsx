'use client';

import { useContext, useEffect } from 'react';
import { StudyMaterialContext } from '@/contexts/study-material-context';
import { DocumentSummarizer } from "@/components/dashboard/document-summarizer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import Link from 'next/link';

export default function SummaryPage() {
    const { studyMaterial, summary, setDocumentTitle, setSummary, setFlashcards, setIsSaved, setStudyMaterial } = useContext(StudyMaterialContext);

    useEffect(() => {
        const loadedMaterial = localStorage.getItem('loadedMaterial');
        if (loadedMaterial && !summary) {
            const material = JSON.parse(loadedMaterial);
            setDocumentTitle(material.title);
            setSummary({ summary: material.summary });
            setFlashcards(material.flashcards);
            setIsSaved(material.isSaved);
            setStudyMaterial('LOADED_FROM_MATERIALS');
            localStorage.removeItem('loadedMaterial');
        }
    }, [summary, setDocumentTitle, setSummary, setFlashcards, setIsSaved, setStudyMaterial]);

    console.log('Summary page - studyMaterial:', studyMaterial);
    console.log('Summary page - summary:', summary);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Document Summary</h1>
                <p className="text-muted-foreground">
                    Get a concise AI-generated summary of your uploaded material.
                </p>
            </div>
            <DocumentSummarizer />
        </div>
    );
}
