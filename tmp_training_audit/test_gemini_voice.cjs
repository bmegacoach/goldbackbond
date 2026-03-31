const https = require('https');
const fs = require('fs');
const path = require('path');

// Manually read .env if possible or use process.env
const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!key) {
    console.error("ERROR: GOOGLE_GENERATIVE_AI_API_KEY not found in environment.");
    process.exit(1);
}

function post(url, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ ok: res.statusCode < 400, status: res.statusCode, json: () => JSON.parse(body) }));
        });
        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
}

async function testVoice(modelId) {
    console.log(`\n--- Testing Model: ${modelId} ---`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${key}`;
    
    try {
        const brainData = await post(url, {
            systemInstruction: { parts: [{ text: "Respond in strict JSON: { \"reply\": \"Hello\" }" }] },
            contents: [{ role: 'user', parts: [{ text: "Say hello." }] }],
            generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
        });

        const resJson = await brainData.json();
        console.log(`Brain Response (${modelId}):`, JSON.stringify(resJson).substring(0, 200));

        const voiceData = await post(url, {
            contents: [{ parts: [{ text: "Hello, this is a high-fidelity test." }] }],
            generationConfig: { 
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } } }
            }
        });

        const vJson = await voiceData.json();
        const audio = vJson.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (audio) {
            console.log(`SUCCESS: ${modelId} generated ${audio.length} bytes.`);
        } else {
            console.warn(`WARNING: ${modelId} failed audio. Error:`, JSON.stringify(vJson).substring(0, 200));
        }
    } catch (err) {
        console.error(`Error ${modelId}:`, err.message);
    }
}

async function run() {
    console.log("Starting Stress Test...");
    const models = ["gemini-3.1-flash-lite-preview", "gemini-3-flash-preview", "gemini-2.0-flash"];
    for (const m of models) {
        await testVoice(m);
    }
}

run();
