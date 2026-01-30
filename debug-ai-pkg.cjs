try {
    const pkg = require('@google/genai');
    console.log('Package @google/genai loaded successfully');
    console.log('Exports:', Object.keys(pkg));
} catch (e) {
    console.error('Failed to load @google/genai:', e.message);
    try {
        const pkg2 = require('@google/generative-ai');
        console.log('Found @google/generative-ai instead');
        console.log('Exports:', Object.keys(pkg2));
    } catch (e2) {
        console.error('Failed to load @google/generative-ai:', e2.message);
    }
}
