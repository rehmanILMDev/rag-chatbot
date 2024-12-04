import { generateObject } from 'ai';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();
  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });
  const result = await generateObject({
    model: groq("llama-3.1-8b-instant"),
    system: 'You generate three notifications for a messages app.',
    prompt,
    schema: z.object({
      notifications: z.array(
        z.object({
          name: z.string().describe('Name of a fictional person.'),
          message: z.string().describe('Do not use emojis or links.'),
          minutesAgo: z.number(),
        }),
      ),
    }),
  });
console.log(result.object, "ufvyctu");

  return result.toJsonResponse();
}