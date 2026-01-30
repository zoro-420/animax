// Simple validation script - run with: node src/tests/auth.test.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

console.log('🧪 Starting Authentication Tests...\n');

const tests = {
    passed: 0,
    failed: 0,
    results: []
};

function test(name, condition) {
    if (condition) {
        tests.passed++;
        tests.results.push(`✅ ${name}`);
    } else {
        tests.failed++;
        tests.results.push(`❌ ${name}`);
    }
}

async function runTests() {
    // Test 1: Check Firebase config exists
    try {
        const configExists = fs.existsSync(path.join(rootDir, 'services/firebase.ts')) ||
            fs.existsSync(path.join(rootDir, 'src/services/firebase.ts'));
        test('Firebase config file exists', configExists);
    } catch (e) {
        test('Firebase config file exists', false);
    }

    // Test 2: Check AuthContext exists
    try {
        const authContextExists = fs.existsSync(path.join(rootDir, 'context/AuthContext.tsx')) ||
            fs.existsSync(path.join(rootDir, 'src/context/AuthContext.tsx'));
        test('AuthContext file exists', authContextExists);
    } catch (e) {
        test('AuthContext file exists', false);
    }

    // Test 3: Check SignIn page exists
    try {
        const signInExists = fs.existsSync(path.join(rootDir, 'pages/SignIn.tsx')) ||
            fs.existsSync(path.join(rootDir, 'src/pages/SignIn.tsx'));
        test('SignIn page exists', signInExists);
    } catch (e) {
        test('SignIn page exists', false);
    }

    // Test 4: Check SignUp page exists
    try {
        const signUpExists = fs.existsSync(path.join(rootDir, 'pages/SignUp.tsx')) ||
            fs.existsSync(path.join(rootDir, 'src/pages/SignUp.tsx'));
        test('SignUp page exists', signUpExists);
    } catch (e) {
        test('SignUp page exists', false);
    }

    // Test 5: Check ProtectedRoute exists
    try {
        const protectedRouteExists = fs.existsSync(path.join(rootDir, 'components/ProtectedRoute.tsx')) ||
            fs.existsSync(path.join(rootDir, 'src/components/ProtectedRoute.tsx'));
        test('ProtectedRoute component exists', protectedRouteExists);
    } catch (e) {
        test('ProtectedRoute component exists', false);
    }

    // Test 6: Check environment variables
    try {
        const envExists = fs.existsSync(path.join(rootDir, '.env.local')) || fs.existsSync(path.join(rootDir, '.env'));
        test('Environment file exists', envExists);
    } catch (e) {
        test('Environment file exists', false);
    }

    // Print results
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    tests.results.forEach(r => console.log(r));
    console.log('================');
    console.log(`Total: ${tests.passed + tests.failed} | Passed: ${tests.passed} | Failed: ${tests.failed}`);

    if (tests.failed > 0) {
        console.log('\n⚠️  Some tests failed. Please fix issues before proceeding.');
        process.exit(1);
    } else {
        console.log('\n🎉 All tests passed! Authentication setup is complete.');
    }
}

runTests().catch(console.error);
