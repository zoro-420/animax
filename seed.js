import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAHXOF4fFVNlzscCEQukLBeGXJ_SiWm5xQ",
    authDomain: "animax-5df50.firebaseapp.com",
    projectId: "animax-5df50",
    storageBucket: "animax-5df50.firebasestorage.app",
    messagingSenderId: "642862427978",
    appId: "1:642862427978:web:e7b35fb781d7441a6b9bb3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const DATA = [
    {
        id: '1',
        title: 'Solo Leveling',
        japaneseTitle: 'Ore dake Level Up na Ken',
        coverImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-61m8996N7v8n.png',
        bannerImage: '/assets/hero-solo-leveling.png',
        description: 'In a world where hunters, humans who possess magical abilities, must battle deadly monsters to protect mankind from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival.',
        rating: 9.1,
        genres: ['Action', 'Adventure', 'Fantasy'],
        year: 2024,
        status: 'Ongoing',
        type: 'TV',
        quality: 'HD',
        totalEpisodes: 12,
        currentEpisode: 8,
        hasDub: true,
        hasSub: true,
        availableLanguages: ['English', 'Japanese', 'Spanish', 'French'],
        watchOrder: []
    },
    {
        id: '2',
        title: 'One Piece',
        japaneseTitle: 'Wan Pīsu',
        coverImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21-6O9iDR9yvM0v.jpg',
        bannerImage: '/assets/hero-one-piece.png',
        description: 'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world.',
        rating: 9.5,
        genres: ['Action', 'Adventure', 'Comedy'],
        year: 1999,
        status: 'Ongoing',
        type: 'TV',
        quality: 'HD',
        currentEpisode: 1100,
        hasDub: true,
        hasSub: true,
        availableLanguages: ['English', 'Japanese'],
        watchOrder: []
    },
    {
        id: '4',
        title: 'Frieren: Beyond Journey\'s End',
        japaneseTitle: 'Sousou no Frieren',
        coverImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-Y9FfE7N9f7N9.png',
        bannerImage: '/assets/hero-frieren.png',
        description: 'The mage Frieren and her fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren, being an elf, will outlive the rest of her party.',
        rating: 9.6,
        genres: ['Adventure', 'Drama', 'Fantasy'],
        year: 2023,
        status: 'Completed',
        type: 'TV',
        quality: 'FHD',
        totalEpisodes: 28,
        currentEpisode: 28,
        hasDub: true,
        hasSub: true,
        availableLanguages: ['English', 'Japanese'],
        watchOrder: []
    }
];

const seed = async () => {
    console.log('🌱 Starting seed process with local assets...');
    try {
        await signInAnonymously(auth);
        console.log('🔑 Signed in anonymously');
    } catch (e) {
        console.warn('⚠️ Anonymous auth failed:', e.code);
    }

    let success = 0;
    for (const anime of DATA) {
        try {
            await setDoc(doc(db, 'anime', anime.id), anime);
            console.log(`✅ Seeded: ${anime.title}`);
            success++;
        } catch (e) {
            console.error(`❌ Failed: ${anime.title}`, e.code);
        }
    }
    console.log(`\n✨ Seed complete! ${success}/${DATA.length} items added.`);
};

seed();
