import { systemKnowledge } from './aiContext.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const body = await req.json();
  const message = body.message;
  const category = body.category;
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ success: false, error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const prompt = `You are the Goldbackbond AI Sales Coach and Customer Support Agent.
Your goal is to assist users with the platform, leaning heavily towards driving sales, onboarding investors, and detailing structured collateral lending. Answer directly and precisely using the documentation.
Here is the complete knowledge base for the Goldbackbond ecosystem:

--- KNOWLEDGE BASE START ---
${systemKnowledge}
--- KNOWLEDGE BASE END ---

The user is asking a question in the category: ${category}.
User message: ${message}

Respond to the user utilizing the knowledge base. Be highly persuasive regarding sales and security. Address them directly. Assume this chat is integrated into our live customer portal.

Respond in strictly valid JSON format with no markdown wrappers or extra text. The JSON must have the exact following structure:
{
  "response": "Your helpful, sales-oriented response directly to the user (can use markdown styling for emphasis)",
  "suggestedActions": ["Short Action 1", "Short Action 2"],
  "escalate": false 
}`;

  try {
    const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=\${apiKey}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(text);

    return new Response(JSON.stringify({
      success: true,
      data: {
        response: parsed.response,
        suggestedActions: parsed.suggestedActions || [],
        escalate: parsed.escalate || false,
        responseTime: 0,
        timestamp: new Date().toISOString()
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'AI request failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
