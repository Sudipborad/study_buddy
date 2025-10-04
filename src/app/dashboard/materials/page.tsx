
'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getMaterials, deleteMaterial } from '@/lib/firebase/firestore';
import { StudyMaterialContext } from '@/contexts/study-material-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, BookOpen, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Material {
    id: string;
    title: string;
    content: string;
    type: string;
    createdAt: string;
}

export default function MaterialsPage() {
    const { user } = useAuth();
    const { setStudyMaterial } = useContext(StudyMaterialContext);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            fetchMaterials();
        } else {
            router.push('/dashboard');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, router]);

    const fetchMaterials = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userMaterials = await getMaterials(user.uid);
            setMaterials(userMaterials as Material[]);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch materials.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMaterial = (content: string) => {
        setStudyMaterial(content);
        toast({ title: 'Material Loaded', description: 'The document is now active in all AI tools.' });
        router.push('/dashboard/summary');
    };

    const handleDeleteMaterial = async (materialId: string) => {
        if (!user) return;
        try {
            await deleteMaterial(user.uid, materialId);
            setMaterials(materials.filter(m => m.id !== materialId));
            toast({ title: 'Success', description: 'Material deleted successfully.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete material.' });
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
                    Here are all the documents you have saved. Load one to start using the AI tools.
                </p>
            </div>
            
            {materials.length === 0 ? (
                <Card className="text-center p-10 bg-secondary/50 border-dashed">
                    <CardHeader>
                        <CardTitle className="font-headline">No Materials Found</CardTitle>
                        <CardDescription>You haven't saved any study materials yet.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild>
                            <Link href="/dashboard/upload">
                                <PlusCircle className="mr-2" />
                                Upload Your First Document
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {materials.map(material => (
                        <Card key={material.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="font-headline truncate">{material.title}</CardTitle>
                                <CardDescription>
                                    Uploaded on {material.createdAt}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {material.content}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button onClick={() => handleLoadMaterial(material.content)}>
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Load
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteMaterial(material.id)}>
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
