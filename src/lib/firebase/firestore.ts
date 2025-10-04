
import { db } from './config';
import { collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';

interface MaterialData {
    title: string;
    content: string;
    type: string;
}

export const addMaterial = async (userId: string, materialData: MaterialData) => {
    try {
        await addDoc(collection(db, 'users', userId, 'materials'), {
            ...materialData,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error adding document: ', error);
        throw new Error('Failed to save material.');
    }
};

export const getMaterials = async (userId: string) => {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'materials'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
    }));
};

export const deleteMaterial = async (userId: string, materialId: string) => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'materials', materialId));
    } catch (error) {
        console.error('Error deleting document: ', error);
        throw new Error('Failed to delete material.');
    }
}
