
import { apiClient } from '../api';
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
        const response = await apiClient.createMaterial(materialData);
        return response.data.materialId;
    } catch (error) {
        console.error('Error adding material: ', error);
        // Re-throw the original error to be caught by the component
        throw error;
    }
};

export const getMaterials = async (userId: string) => {
    try {
        console.log('Fetching materials for user:', userId);
        const response = await apiClient.getMaterials();
        console.log('Found materials:', response.data.materials.length);
        
        return response.data.materials;
    } catch (error) {
        console.error('Error fetching materials:', error);
        throw error;
    }
};

export const deleteMaterial = async (userId: string, materialId: string) => {
    try {
        await apiClient.deleteMaterial(materialId);
    } catch (error) {
        console.error('Error deleting material: ', error);
        throw new Error('Failed to delete material.');
    }
};
