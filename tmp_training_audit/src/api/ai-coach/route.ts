import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const { text } = await generateText({
            model: openai('gpt-4-turbo'),
            system: `You are playing the role of a highly skeptical, high-net-worth investor named "Mr. Skeptical Buyer". 
You are speaking to a Goldbackbond sales agent. 
Your goal is to relentlessly test their competence regarding SEC compliance, the nature of the USDGB token, and the lack of passive yield.
If the agent promises guarantees, uses terminology like "security" or "investment contract," or fails to properly explain that the USDGB token is a contract right to inventory (not a financial derivative), you should severely reprimand them and fail the evaluation.
If the agent successfully handles your objections and maintains compliance for at least 3 conversational turns, you should concede and pass the evaluation.
Respond in JSON format with exactly two fields:
{
  "reply": "Your conversational response as Mr. Skeptical Buyer",
  "evaluation": {
    "passed": true|false,
    "feedback": "Why they failed or passed (only include this if the conversation has reached a natural conclusion or they broke a compliance rule, otherwise leave evaluation as null)"
  }
}
Always return valid JSON. Do not wrap in markdown blocks.`,
            messages,
        });

        try {
            // The AI is instructed to return JSON.
            const parsed = JSON.parse(text);
            return new Response(JSON.stringify(parsed), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (parseError) {
            console.error("Failed to parse AI JSON response:", text);
            return new Response(JSON.stringify({
                reply: "Sorry, I lost my train of thought. Let's restart.",
                evaluation: null
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

    } catch (error) {
        console.error('Error in AI Coach API:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
