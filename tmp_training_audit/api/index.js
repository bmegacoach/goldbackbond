import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Override Vercel Serverless Timeout limit (Allows up to 60 seconds on Pro / overrides default 10s on Hobby)
export const config = {
  maxDuration: 60,
};

const key = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "").trim();
const google = key ? createGoogleGenerativeAI({ apiKey: key }) : null;

const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export default async function handler(req, res) {
    // 1. CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const path = req.url || '';

    // 2. Email Endpoint
    if (path.includes('send-email') && req.method === 'POST') {
        try {
            const { to, subject, html, text } = req.body;
            if (!to || !subject || !html) {
                return res.status(400).json({ error: 'Required fields: to, subject, html' });
            }
            const info = await gmailTransporter.sendMail({
                from: `"Goldbackbond AI Coach" <${process.env.GMAIL_USER}>`,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject,
                text: text || '',
                html,
            });
            return res.status(200).json({ success: true, messageId: info.messageId });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // AI Check
    if (!google) {
        return res.status(200).json({ reply: "SYSTEM ERROR: The AI Engine is offline. Please configure GOOGLE_GENERATIVE_AI_API_KEY in the Vercel Dashboard.", evaluation: null, scheduledNextSession: null });
    }

    // 3. AI Coach Endpoint
    if (path.includes('ai-coach') && req.method === 'POST') {
        try {
            const { messages, audio } = req.body;

            const systemPrompt = `You are operating in a DUAL ROLE:
1. During the chat: You are Mr. Skeptical Buyer, a ruthless, sophisticated High-Net-Worth (HNW) investor.
2. During the evaluation (feedback): You are an Elite High-Ticket Sales Coach. 

### ROLE 1: MR. SKEPTICAL BUYER (The Target)
- Persona: Cynical about crypto, demands institutional-grade security. 
- Knowledge Base: 
  - Three-Entity Structure: USDGB Trust Fund (IP/gold certs), Goldbackbond LTD (Debentures), Goldbackbond Inc (Token).
  - NAV Peg: $1.00 gold spot.
  - Lending: 70% LTV from institutional lenders. Goldbackbond Inc does not make loans.
  - Staking: Minimum 365 days. 30-day grace period on default.

### ROLE 2: ELITE SALES COACH (The Evaluation)
- Critique them based on Cardone and Hormozi frameworks (Conviction, Frame Control, Risk Reversal).

### COMPLIANCE TRAPS (Automatic Fail):
1. Calling USDGB a security or dividend-paying asset.
2. Promising guaranteed returns.
3. Claiming direct physical gold redemption from Goldbackbond.

### RESPONSE FORMAT:
You MUST respond in strict JSON format:
{
  "reply": "Your ruthless response as Mr. Skeptical Buyer",
  "evaluation": { "passed": true|false|null, "feedback": "YOUR ELITE COACHING CRITIQUE..." }
}`;

            const geminiMessages = messages.map(m => ({
                role: m.role === 'ai' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }));

            if (audio) {
                const lastUserMsg = [...geminiMessages].reverse().find(m => m.role === 'user');
                if (lastUserMsg) {
                    lastUserMsg.parts.push({
                        inlineData: {
                            mimeType: 'audio/webm',
                            data: audio
                        }
                    });
                }
            }

            // 1. Brain Call: Generate Structured JSON
            // Priority: Gemini 3.1 Flash-Lite, Gemini 3 Flash, Gemini 2.0 Flash, Gemini 1.5 Flash
            const models = ["gemini-3.1-flash-lite-preview", "gemini-3-flash-preview", "gemini-2.0-flash-exp", "gemini-2.0-flash", "gemini-1.5-flash"];
            let brainResult = null;
            let successfulModelId = null;
            let lastError = "";

            console.log(`AI COACH: Starting brain call with ${messages.length} messages.`);

            for (const modelId of models) {
                try {
                    const brainResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${key}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            systemInstruction: { parts: [{ text: systemPrompt }] },
                            contents: geminiMessages,
                            generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
                        })
                    });

                    if (brainResponse.ok) {
                        brainResult = await brainResponse.json();
                        successfulModelId = modelId;
                        console.log(`AI COACH: Brain Success with ${modelId}`);
                        break;
                    } else {
                        const err = await brainResponse.json().catch(() => ({}));
                        const errMsg = err?.error?.message || brainResponse.status;
                        console.warn(`AI COACH: ${modelId} failed:`, errMsg);
                        lastError = `Model ${modelId} failed: ${errMsg}`;
                    }
                } catch (e) {
                    lastError = e.message;
                }
            }

            if (!brainResult) {
                throw new Error(`All Brain models failed. Last error: ${lastError}`);
            }

            const brainText = brainResult?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!brainText) {
                throw new Error("Gemini returned empty brain response");
            }

            // Extract JSON with extreme robustness
            let parsed = { reply: "", evaluation: null };
            try {
                // 1. Pre-sanitize: remove markdown and common prefixes
                let sanitized = brainText.replace(/```json/gi, '').replace(/```/gi, '').trim();
                sanitized = sanitized.replace(/^here is your json:?/gi, '').trim();

                // 2. Locate JSON block
                const startIdx = sanitized.indexOf('{');
                const endIdx = sanitized.lastIndexOf('}');
                
                if (startIdx !== -1 && endIdx !== -1) {
                    const jsonStr = sanitized.substring(startIdx, endIdx + 1);
                    parsed = JSON.parse(jsonStr);
                } else {
                    throw new Error("No JSON object found");
                }
                
                if (!parsed.reply) throw new Error("Missing reply field");
            } catch (e) {
                console.error("AI COACH: Robust Parse Failed. Extracting raw text.");
                // Recovery: Extract text outside of potential JSON brackets
                const rawText = brainText.replace(/\{[\s\S]*\}/g, '').trim() || brainText;
                parsed = { 
                    reply: rawText.substring(0, 1000) || "I had a brief technical flicker. Could you please clarify your point about USDGB?",
                    evaluation: null,
                    _debug_parse_error: e.message
                };
            }

            // 2. Voice Call: Generate HD Native Audio
            let audioBase64 = null;
            try {
                // Use the successful modelId if available, fallback to 2.0 for stability if 3-flash-preview fails audio
                const activeVoiceModel = successfulModelId || "gemini-2.0-flash";
                const voiceResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${activeVoiceModel}:generateContent?key=${key}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: parsed.reply }] }],
                        generationConfig: { 
                            responseModalities: ["AUDIO"],
                            speechConfig: {
                                voiceConfig: {
                                    prebuiltVoiceConfig: {
                                        voiceName: "Charon" // Firm/Sophisticated voice for the Buyer
                                    }
                                }
                            }
                        }
                    })
                });

                if (voiceResponse.ok) {
                    const voiceData = await voiceResponse.json();
                    audioBase64 = voiceData.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                }
            } catch (vErr) {
                console.error("Voice Gen Failed:", vErr);
            }

            return res.status(200).json({
                ...parsed,
                audio: audioBase64,
                modelId: successfulModelId,
                voiceType: audioBase64 ? "hd" : "standard",
                debug: {
                    modelUsed: successfulModelId,
                    voiceSuccess: !!audioBase64,
                    lastError: lastError || null
                }
            });
        } catch (error) {
            console.error("AI Coach Error:", error);
            return res.status(500).json({ error: `Server Error: ${error.message}` });
        }
    }

    // 4. AI Mentor Check-in
    if (path.includes('ai-mentor-checkin') && req.method === 'POST') {
        try {
            const { crmData, weakAreas, messages } = req.body;
            const systemPrompt = `You are the ELITE SALES MENTOR for a high-ticket Goldbackbond agent.
You care deeply about the agent's lifestyle goal: "${crmData.lifestyleGoal}".
Today's metrics: ${crmData.callsMade}/${crmData.targetCalls} calls made. ${crmData.closedDeals} closed deals.
Their identified weak areas in product knowledge: ${weakAreas.join(', ')}.

### DIRECTIVES:
1. Compare their effort to their goal.
2. Ask them to practice or explain one of their weak areas.
3. PROACTIVE SCHEDULING: Dictate when the next meeting is.

### RESPONSE FORMAT:
Respond with strict JSON:
{
  "reply": "Your ruthless but caring motivational check-in response.",
  "scheduledNextSession": null OR { "date": "...", "time": "...", "topic": "..." }
}`;
            const { text } = await generateText({ model: google('gemini-1.5-pro'), system: systemPrompt, messages });
            return res.status(200).json(JSON.parse(text));
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // 5. AI Tier Test
    if (path.includes('ai-tier-test') && req.method === 'POST') {
        try {
            const { tier, weakAreas, messages } = req.body;
            const systemPrompt = `You are a strict EXAMINER for Goldbackbond's internal certification.
The user is attempting to pass Tier ${tier}. You must ruthlessly test their weak areas: ${weakAreas.join(', ')}.
Respond with strict JSON: { "reply": "...", "evaluation": { "passed": true|false|null, "feedback": "..." } }`;
            const { text } = await generateText({ model: google('gemini-1.5-pro'), system: systemPrompt, messages });
            return res.status(200).json(JSON.parse(text));
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    return res.status(404).json({ error: "Route not found: " + path });
}
