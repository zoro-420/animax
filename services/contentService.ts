import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import { Anime, ContentType } from '../types';

import { MOCK_ANIME_CATALOG } from '../constants';

const COLLECTION = 'anime';

export const getAnimeCatalog = async (): Promise<Anime[]> => {
    try {
        const q = query(collection(db, COLLECTION), orderBy('title'));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            console.warn('Firestore empty, returning MOCK data');
            return MOCK_ANIME_CATALOG;
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Anime));
    } catch (error) {
        console.error('Error fetching catalog, returning MOCK data:', error);
        return MOCK_ANIME_CATALOG;
    }
};

export const getAnimeById = async (id: string): Promise<Anime | null> => {
    try {
        const docRef = doc(db, COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Anime;
        }
        // Fallback to mock
        return MOCK_ANIME_CATALOG.find(a => a.id === id) || null;
    } catch (error) {
        console.error(`Error fetching anime ${id}:`, error);
        return MOCK_ANIME_CATALOG.find(a => a.id === id) || null;
    }
};

export const getTrendingAnime = async (limitCount = 5): Promise<Anime[]> => {
    try {
        // For now, trending is just high rated
        const q = query(
            collection(db, COLLECTION),
            orderBy('rating', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return MOCK_ANIME_CATALOG.slice(0, limitCount);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Anime));
    } catch (error) {
        console.error('Error fetching trending:', error);
        return MOCK_ANIME_CATALOG.slice(0, limitCount);
    }
};

export const getNewReleases = async (limitCount = 5): Promise<Anime[]> => {
    try {
        const q = query(
            collection(db, COLLECTION),
            orderBy('year', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return [...MOCK_ANIME_CATALOG].sort((a, b) => b.year - a.year).slice(0, limitCount);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Anime));
    } catch (error) {
        console.error('Error fetching new releases:', error);
        return [...MOCK_ANIME_CATALOG].sort((a, b) => b.year - a.year).slice(0, limitCount);
    }
};

export const searchAnime = async (term: string): Promise<Anime[]> => {
    // Client-side filtering because Firestore simple search is limited
    // In a real app with Algolia/Typesense, this would be server-side
    try {
        const catalog = await getAnimeCatalog();
        const lowerTerm = term.toLowerCase();
        return catalog.filter(anime =>
            anime.title.toLowerCase().includes(lowerTerm) ||
            anime.description.toLowerCase().includes(lowerTerm) ||
            (anime.japaneseTitle && anime.japaneseTitle.toLowerCase().includes(lowerTerm))
        );
    } catch (error) {
        console.error('Error searching anime:', error);
        return [];
    }
};
