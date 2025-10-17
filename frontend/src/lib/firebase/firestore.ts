
import { db } from './config';
import { collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { Flashcard } from '../types';

interface StudySetData {
    title: string;
    summary: string;
    flashcards: Flashcard[];
}

interface FlashcardSetData {
    title: string;
    flashcards: Flashcard[];
    sourceDocument?: string;
}

export const addMaterial = async (userId: string, materialData: StudySetData) => {
    try {
        const docRef = await addDoc(collection(db, 'users', userId, 'materials'), {
            ...materialData,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding document: ', error);
        // Re-throw the original error to be caught by the component
        throw error;
    }
};

export const getMaterials = async (userId: string) => {
    try {
        console.log('Fetching materials for user:', userId);
        const materialsQuery = query(collection(db, 'users', userId, 'materials'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(materialsQuery);
        console.log('Found materials:', querySnapshot.size);
        
        const materials = querySnapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Material data:', { id: doc.id, title: data.title });
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
            };
        });
        
        return materials;
    } catch (error) {
        console.error('Error fetching materials:', error);
        throw error;
    }
};

export const deleteMaterial = async (userId: string, materialId: string) => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'materials', materialId));
    } catch (error) {
        console.error('Error deleting document: ', error);
        throw new Error('Failed to delete material.');
    }
}
