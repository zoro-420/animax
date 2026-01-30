import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from '../types';

export const addToWatchlist = async (uid: string, animeId: string): Promise<boolean> => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            watchlist: arrayUnion(animeId)
        });
        return true;
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        return false;
    }
};

export const removeFromWatchlist = async (uid: string, animeId: string): Promise<boolean> => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            watchlist: arrayRemove(animeId)
        });
        return true;
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        return false;
    }
};

export const getUserWatchlist = async (uid: string): Promise<string[]> => {
    try {
        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as User;
            return data.watchlist || [];
        }
        return [];
    } catch (error) {
        console.error('Error getting watchlist:', error);
        return [];
    }
};

export const addToHistory = async (uid: string, animeId: string): Promise<boolean> => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            history: arrayUnion(animeId)
        });
        return true;
    } catch (error) {
        console.error('Error adding to history:', error);
        return false;
    }
};
