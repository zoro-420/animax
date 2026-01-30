import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// Read env file manually
const envPath = path.join(rootDir, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envVars[key.trim()] = value.trim();
});

const firebaseConfig = {
    apiKey: envVars.VITE_FIREBASE_API_KEY,
    authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: envVars.VITE_FIREBASE_PROJECT_ID,
    storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: envVars.VITE_FIREBASE_APP_ID
};

console.log('🔥 Testing Firebase Connection...');
console.log(`   Project ID: ${firebaseConfig.projectId}`);

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Test Write
    const testDocRef = doc(db, 'system_checks', 'connection_test');
    await setDoc(testDocRef, {
        connected: true,
        timestamp: new Date().toISOString(),
        agent: 'Antigravity'
    });
    console.log('✅ Firestore Write Success');

    // Test Read
    const docSnap = await getDoc(testDocRef);
    if (docSnap.exists()) {
        console.log('✅ Firestore Read Success');
    } else {
        throw new Error('Document written but not found');
    }

    // Cleanup
    await deleteDoc(testDocRef);
    console.log('✅ Cleanup Success');
    console.log('\n🎉 Firebase is fully connected and operational!');

} catch (error) {
    console.error('\n❌ Connection Failed:', error.message);
    if (error.code === 'permission-denied') {
        console.error('   Hint: Check your Firestore Security Rules. For testing, allow read/write.');
    }
    process.exit(1);
}
