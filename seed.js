import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Configuration from .env.local
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
        title: 'Fate/Chronicle: Zero',
        japaneseTitle: 'Feito/Kuronikuru',
        coverImage: 'https://picsum.photos/300/450?random=1',
        bannerImage: 'https://picsum.photos/1200/600?random=10',
        description: 'In a world where mages battle for the omnipotent Grail, seven masters summon heroic spirits. This series details the events of the 4th War, a tragic prelude to the main storyline. Dark, gritty, and visually stunning.',
        rating: 9.2,
        genres: ['Action', 'Fantasy'],
        year: 2011,
        status: 'Completed',
        type: 'TV',
        quality: 'FHD',
        totalEpisodes: 25,
        currentEpisode: 25,
        hasDub: true,
        hasSub: true,
        availableLanguages: ['Japanese (Sub)', 'English (Dub)', 'Spanish (Dub)', 'German (Sub)'],
        watchOrder: [
            { id: 'e1', type: 'EPISODE', title: 'The Summoning', duration: '48m', orderIndex: 1, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=101', description: 'The masters begin their preparations.' },
            { id: 'e2', type: 'EPISODE', title: 'False Start', duration: '24m', orderIndex: 2, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=102', description: 'The first battle commences at the docks.' },
            { id: 'e3', type: 'EPISODE', title: 'Land of Fuyuki', duration: '24m', orderIndex: 3, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=103', description: 'Secrets of the city are revealed.' },
            { id: 'm1', type: 'MOVIE', title: 'Fate/Chronicle: The Lost Butterfly', duration: '1h 58m', orderIndex: 4, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=104', description: 'A mandatory movie bridging the gap between seasons.' },
            { id: 'e4', type: 'EPISODE', title: 'The Final Command', duration: '24m', orderIndex: 5, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=105', description: 'The war reaches its climax.' },
        ]
    },
    {
        id: '2',
        title: 'Cyber Blade Runner',
        japaneseTitle: 'Saiba Bureddu',
        coverImage: 'https://picsum.photos/300/450?random=2',
        bannerImage: 'https://picsum.photos/1200/600?random=20',
        description: 'A street kid tries to survive in a technology-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner—a mercenary outlaw.',
        rating: 8.9,
        genres: ['Sci-Fi', 'Cyberpunk'],
        year: 2022,
        status: 'Completed',
        type: 'TV',
        quality: '4K',
        totalEpisodes: 10,
        currentEpisode: 10,
        hasDub: true,
        hasSub: true,
        availableLanguages: ['Japanese (Sub)', 'English (Dub)', 'French (Dub)'],
        watchOrder: [
            { id: 'e1', type: 'EPISODE', title: 'Let You Down', duration: '24m', orderIndex: 1, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=201', description: 'Life in Night City is tough.' },
            { id: 'e2', type: 'EPISODE', title: 'Like A Boy', duration: '24m', orderIndex: 2, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=202', description: 'He gets his first upgrade.' },
        ]
    },
    {
        id: '3',
        title: 'Titan\'s Fall',
        japaneseTitle: 'Kyojin no Fall',
        coverImage: 'https://picsum.photos/300/450?random=3',
        bannerImage: 'https://picsum.photos/1200/600?random=30',
        description: 'Humanity lives inside cities surrounded by enormous walls that protect them from gigantic man-eating humanoids.',
        rating: 9.5,
        genres: ['Action', 'Drama'],
        year: 2013,
        status: 'Ongoing',
        type: 'TV',
        quality: 'HD',
        totalEpisodes: 88,
        currentEpisode: 87,
        hasDub: true,
        hasSub: true,
        nextEpisodeDate: '2025-06-15',
        availableLanguages: ['Japanese (Sub)', 'English (Dub)', 'Portuguese (Sub)'],
        watchOrder: [
            { id: 'e1', type: 'EPISODE', title: 'To You, 2000 Years Later', duration: '24m', orderIndex: 1, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=301', description: 'The wall is breached.' },
            { id: 'ova1', type: 'OVA', title: 'Ilse\'s Notebook', duration: '28m', orderIndex: 1.5, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=302', description: 'A scout finds a strange journal.' },
            { id: 'e2', type: 'EPISODE', title: 'That Day', duration: '24m', orderIndex: 2, isReleased: true, thumbnail: 'https://picsum.photos/300/170?random=303', description: 'Training begins.' },
        ]
    },
    {
        id: '4',
        title: 'Spirit Detective',
        coverImage: 'https://picsum.photos/300/450?random=4',
        bannerImage: 'https://picsum.photos/1200/600?random=40',
        description: 'A delinquent teenage boy who is struck and killed by a car while attempting to save a child\'s life gets a second chance.',
        rating: 8.5,
        genres: ['Supernatural', 'Action'],
        year: 1992,
        status: 'Completed',
        type: 'TV',
        quality: 'HD',
        totalEpisodes: 112,
        currentEpisode: 112,
        hasDub: true,
        hasSub: false,
        availableLanguages: ['Japanese (Sub)', 'English (Dub)'],
        watchOrder: []
    },
    {
        id: '5',
        title: 'Space Cowboy Bebop',
        coverImage: 'https://picsum.photos/300/450?random=5',
        bannerImage: 'https://picsum.photos/1200/600?random=50',
        description: 'The futuristic misadventures and tragedies of an easygoing bounty hunter and his partners.',
        rating: 9.8,
        genres: ['Sci-Fi', 'Noir'],
        year: 1998,
        status: 'Completed',
        type: 'TV',
        quality: 'FHD',
        totalEpisodes: 26,
        currentEpisode: 26,
        hasDub: true,
        hasSub: true,
        availableLanguages: ['Japanese (Sub)', 'English (Dub)'],
        watchOrder: []
    },
    {
        id: '6',
        title: 'Demon Slayer: Village Arc',
        japaneseTitle: 'Kimetsu no Yaiba',
        coverImage: 'https://picsum.photos/300/450?random=6',
        bannerImage: 'https://picsum.photos/1200/600?random=60',
        description: 'Tanjiro journeys to a village of swordsmiths and has to explain how the sword was so badly damaged to Haganezuka, the smith who made it.',
        rating: 9.1,
        genres: ['Action', 'Demons'],
        year: 2023,
        status: 'Completed',
        type: 'TV',
        quality: '4K',
        totalEpisodes: 11,
        currentEpisode: 11,
        hasDub: true,
        hasSub: true,
        availableLanguages: ['Japanese (Sub)', 'English (Dub)'],
        watchOrder: []
    },
    {
        id: '7',
        title: 'Jujutsu Kaisen: Zero',
        japaneseTitle: 'Jujutsu Kaisen 0',
        coverImage: 'https://picsum.photos/300/450?random=7',
        bannerImage: 'https://picsum.photos/1200/600?random=70',
        description: 'Yuta Okkotsu is a nervous high school student who is suffering from a serious problem—his childhood friend Rika has turned into a curse.',
        rating: 9.0,
        genres: ['Action', 'Supernatural'],
        year: 2021,
        status: 'Completed',
        type: 'Movie',
        quality: '4K',
        totalEpisodes: 1,
        currentEpisode: 1,
        hasDub: true,
        hasSub: true,
        availableLanguages: ['Japanese (Sub)', 'English (Dub)'],
        watchOrder: []
    }
];

const seed = async () => {
    console.log('🌱 starting seed...');

    // Try anonymous login
    try {
        await signInAnonymously(auth);
        console.log('🔑 Signed in anonymously');
    } catch (e) {
        console.warn('⚠️ Anonymous auth failed (enable in console to write). Error:', e.code);
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

    if (success === 0) {
        console.log('\n❌ Seeding failed due to permissions. Ensure Firestore Rules allow writes or Anonymous Auth is enabled.');
    } else {
        console.log(`\n✨ Seed complete! ${success}/${DATA.length} items added.`);
    }
    process.exit(success === DATA.length ? 0 : 1);
}

seed();
