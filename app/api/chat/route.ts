import { createResource } from '@/lib/actions/resources';
import { mistral } from '@ai-sdk/mistral';
import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText, tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';

import { createOllama } from 'ollama-ai-provider';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
// const groq = createOpenAI({
//     baseURL: 'https://api.groq.com/openai/v1',
//     apiKey: process.env.GROQ_API_KEY,
//   });


 

// const ollama = createOllama({
//     baseURL: 'http://localhost:11434/api',

// });

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model : mistral('mistral-large-latest'),
    messages: convertToCoreMessages(messages),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toDataStreamResponse();
}