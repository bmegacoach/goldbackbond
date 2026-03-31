import fetch from 'node-fetch';

async function test() {
    const payload = {
        messages: [{ role: 'user', content: 'Hello' }],
        audio: 'SGVsbG8gd29ybGQ=' // simple base64 "Hello world"
    };

    try {
        const response = await fetch('http://localhost:3000/api/ai-coach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Data:', data);
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
