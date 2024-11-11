'use server';

import { generateText, tool } from 'ai';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { mistral } from '@ai-sdk/mistral';
import * as mathjs from 'mathjs';


export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function getWeather({ city, unit }: any) {
  // This function would normally make an
  // API request to get the weather.

  return { value: 25, description: 'Sunny' };
}
const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});
export async function continueConversation(history: Message[]) {
  'use server';

//   const { text, toolResults } = await generateText({
//     model: mistral('mistral-large-latest'),
//     system: 'You are a friendly weather assistant!',
//     messages: history,
//     tools: {
//       getWeather: {
//         description: 'Get the weather for a location',
//         parameters: z.object({
//           city: z.string().describe('The city to get the weather for'),
//           unit: z
//             .enum(['C', 'F'])
//             .describe('The unit to display the temperature in'),
//         }),
//         execute: async ({ city, unit }) => {
//           const weather = getWeather({ city, unit });
//           return `It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`;
//         },
//       },
//     },
//   });

const problem =
  'A taxi driver earns $9461 per 1-hour of work. ' +
  'If he works 12 hours a day and in 1 hour ' +
  'he uses 12 liters of petrol with a price  of $134 for 1 liter. ' +
  'How much money does he earn in one day?';
  const { text: answer } = await generateText({
    model: groq("llama3-groq-70b-8192-tool-use-preview"),
    system:
      'You are solving math problems. ' +
      'Reason step by step. ' +
      'Use the calculator when necessary. ' +
      'When you give the final answer, ' +
      'provide an explanation for how you arrived at it.',
    prompt: problem,
    tools: {
      calculate: tool({
        description:
          'A tool for evaluating mathematical expressions. ' +
          'Example expressions: ' +
          "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
        parameters: z.object({ expression: z.string() }),
        execute: async ({ expression }) => mathjs.evaluate(expression),
      }),
    },
    maxToolRoundtrips: 10,
  });
  console.log(answer);
  
  return answer;
}