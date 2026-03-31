import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function testVoice(modelId) {
    console.log(`\n--- Testing Model: ${modelId} ---`);
    try {
        const brainResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: "Respond in strict JSON: { \"reply\": \"Hello, how can I help?\" }" }] },
                contents: [{ role: 'user', parts: [{ text: "Say hello and explain USDGB in 10 words." }] }],
                generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
            })
        });

        const brainData = await brainResponse.json();
        if (!brainResponse.ok) {
            console.error(`Brain Call Failed for ${modelId}:`, brainData.error);
            return;
        }

        const brainText = brainData.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(`Brain Response (${modelId}):`, brainText);

        // Test Voice Generation
        const voiceResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello, USDGB is a gold-pegged asset for institutional safety." }] }],
                generationConfig: { 
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: "Charon" 
                            }
                        }
                    }
                }
            })
        });

        const voiceData = await voiceResponse.json();
        if (!voiceResponse.ok) {
            console.error(`Voice Call Failed for ${modelId}:`, voiceData.error);
            return;
        }

        const audio = voiceData.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (audio) {
            console.log(`SUCCESS: ${modelId} generated ${audio.length} bytes of audio.`);
            fs.writeFileSync(`./tmp_training_audit/${modelId}_test.pcm`, Buffer.from(audio, 'base64'));
        } else {
            console.warn(`WARNING: ${modelId} returned no audio data.`);
        }

    } catch (err) {
        console.error(`Error testing ${modelId}:`, err.message);
    }
}

async function runTests() {
    const models = ["gemini-3.1-flash-lite-preview", "gemini-3-flash-preview", "gemini-2.0-flash"];
    for (const m of models) {
        await testVoice(m);
    }
}

runTests();
