import { getChunks } from "@/lib/actions/resources";
import { db } from "@/lib/db";
import { chunk } from "@/lib/db/schema/chunks";
import { createOpenAI } from "@ai-sdk/openai";
import {
  cosineSimilarity,
  embed,
  generateObject,
  generateText,
  streamText,
} from "ai";
import { createOllama } from "ollama-ai-provider";

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const groq = createOpenAI({
//     baseURL: "https://api.groq.com/openai/v1",
//     apiKey: process.env.GROQ_API_KEY,
//   });

//   const ollama = createOllama({
//     baseURL: "http://localhost:11434/api",
//   });

//   const embeddingModel = ollama.embedding("nomic-embed-text:latest");
//   const customModel = groq("llama3-groq-70b-8192-tool-use-preview");

//   // Safely extract the last message
//   const lastMessage = messages.pop();

//   // Ensure the last message exists and has the expected structure
//   if (!lastMessage || lastMessage.role !== "user") {
//     if (lastMessage) {
//       messages.push(lastMessage);
//     }
//     // Continue without RAG if there's no valid user input
//     return streamChat(messages, customModel);
//   }

//   // Handle cases where lastMessage.content is not an array
//   const lastUserMessageContent = Array.isArray(lastMessage.content)
//     ? lastMessage.content
//         .filter((content: { type: string }) => content.type === "text")
//         .map((content: { text: any }) => content.text)
//         .join("\n")
//     : lastMessage.content;

//   if (typeof lastUserMessageContent !== "string") {
//     return new Response("Invalid message format", { status: 400 });
//   }

//   // Classify the user prompt
//   const { object: classification } = await generateObject({
//     model: customModel,
//     output: "enum",
//     enum: ["question", "statement", "other"],
//     system: "Classify the user message as a question, statement, or other.",
//     prompt: lastUserMessageContent,
//   });

//   if (classification !== "question") {
//     // If not a question, proceed without RAG
//     messages.push(lastMessage);
//     return streamChat(messages, customModel);
//   }

//   // Generate a hypothetical answer
//   const { text: hypotheticalAnswer } = await generateText({
//     model: customModel,
//     system: "Provide a hypothetical answer to the user's question.",
//     prompt: lastUserMessageContent,
//   });

//   // Generate embedding for the hypothetical answer
//   const { embedding: hypotheticalAnswerEmbedding } = await embed({
//     model: embeddingModel,
//     value: hypotheticalAnswer,
//   });

//   // Retrieve relevant chunks from the knowledge base
//   const knowledgeBaseChunks = await getChunks(); // Fetch all available knowledge base chunks
//   console.log(knowledgeBaseChunks, "chunksss");

//   const chunksWithSimilarity = knowledgeBaseChunks.map(
//     (chunk: { embedding: number[] }) => ({
//       ...chunk,
//       similarity: cosineSimilarity(
//         hypotheticalAnswerEmbedding,
//         chunk.embedding
//       ),
//     })
//   );
//   console.log(chunksWithSimilarity, "chunk with similarity");

//   // Rank and retrieve top K chunks
//   chunksWithSimilarity.sort(
//     (a: { similarity: number }, b: { similarity: number }) =>
//       b.similarity - a.similarity
//   );
//   const topKChunks = chunksWithSimilarity.slice(0, 10);

//   // Add relevant chunks to the user message
//   messages.push({
//     role: "user",
//     content: [
//       ...(Array.isArray(lastMessage.content) ? lastMessage.content : []),
//       {
//         type: "text",
//         text: "Here is some relevant information to help answer the question:",
//       },
//       ...topKChunks.map((chunk) => ({
//         type: "text",
//         text: chunk.content,
//       })),
//     ],
//   });

//   // Stream the response back
//   const result = await streamText({
//     model: customModel,
//     system:
//       "You are a friendly assistant! Keep your responses concise and helpful.",
//     messages,
//   });

//   return result.toDataStreamResponse({});
// }

// export async function POST(req: Request) {
//   const { messages } = await req.json();

  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });

//   const ollama = createOllama({
//     baseURL: "http://localhost:11434/api",
//   });
//   console.log(messages, "msg log");
//   const lastMessage = messages.pop();
//   const embeddingModel = ollama.embedding("nomic-embed-text:latest");
//   const customModel = groq("llama3-groq-70b-8192-tool-use-preview");
//   const { embedding } = await embed({
//     model: embeddingModel,
//     value: lastMessage.content,
//   });
//   // const context = db.select().from(chunk).map(item => ({
//   //     document: item,
//   //     similarity: cosineSimilarity(embedding, item.embedding),
//   //   }))
//   //   .sort((a, b) => b.similarity - a.similarity)
//   //   .slice(0, 3)
//   //   .map(r => r.document.value)
//   //   .join('\n');

//   const chunks = await db.select().from(chunk);

//   // Check if chunks is an array
//   if (!Array.isArray(chunks)) {
//     throw new Error("Failed to retrieve chunks from the database");
//   }

//   // Calculate similarity, sort, and extract top results
//   const context = chunks
//     .map((chunk: { embedding: number[]; content: string[] }) => ({
//       ...chunk,
//       similarity: cosineSimilarity(embedding, chunk.embedding),
//     }))
//     .sort((a, b) => b.similarity - a.similarity)
//     .slice(0, 3) // Take the top 3 most similar chunks
//     .map((r) => r.content) // Extract the document value from each chunk
//     .join("\n"); // Combine the values into a single string

//   console.log(context, "context");

//   const result = await streamText({
//     model: customModel,
//     system: `You are an advanced assistant for ILM UX Pvt Ltd. Your role is to provide accurate, structured, and contextually relevant responses based solely on the provided context and question. Ensure all responses are:

// - Clear, concise, and actionable.
// - Presented in an organized format, such as bullet points, numbered lists, or headings, for better readability.
// - Professional, user-centric, and aligned with ILM UX Pvt Ltd's standards and objectives.

// Maintain an informative and helpful tone, prioritizing the user's needs while adhering strictly to the given context.`,
//     prompt: `Answer the following question based only on the provided context:
//              ${context}

//              Question: ${lastMessage.content}`,
//   });
//   return result.toDataStreamResponse();
// }

// // Utility to stream a normal chat response
// async function streamChat(messages: any, customModel: any) {
//   const result = await streamText({
//     model: customModel,
//     system:
//       "You are a friendly assistant! Keep your responses concise and helpful.",
//     messages,
//   });

//   return result.toDataStreamResponse({});
// }











import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model:groq("llama3-groq-70b-8192-tool-use-preview"),
    messages,
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: 'show the weather in a given city to the user',
        parameters: z.object({ city: z.string() }),
        execute: async ({}: { city: string }) => {
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          'Get the user location. Always ask for confirmation before using this tool.',
        parameters: z.object({}),
      },
    },
  });

  return (await result).toDataStreamResponse();
}







// import { ChatBot } from "../utils";

// const componentExample = `
// import React from 'react';
// import { ComponentNameOne, ComponentNameTwo } from '@react-agent/shadcn-ui'

// export interface ComponentNameProps {
//   {/* Your interface implementation */}
// }

// const ComponentName = (props: ComponentNameProps) => {
//   return (
//     {/* Your component implementation */}
//   );
// };

// export default ComponentName;
// `;

// const GENERATE_FORM_PROMPT = `
// Act as a Frontend Developer.
// Create Typescript React Functional Component based on the description.
// Make sure it is beautiful and easy to use.
// Make sure it covers all the use cases and states.
// ---
// Return Example:
// ${componentExample}
// ---
// Instructions:
// Make sure it's a working code, don't assume that I'm going to change or implement anything.
// Assume I have React Typescript setup in my project.
// Don't use any external libraries but @react-agent/shadcn-ui which is interal library, recharts for charts.
// ---
// Return Type:
// return a React component, written in Typescript, using Tailwind CSS.
// return the code inside tsx/typescript markdown \`\`\`tsx <Your Code Here> \`\`\`.
// `;
// export class ReactComponentGenerator {
//   private chatbot: ChatBot;
//   private model: string;

//   constructor() {
//     this.model = "gpt-4";
//     // this.model = "gpt-3.5-turbo";
//     this.chatbot = new ChatBot(this.model);
//   }

//   async generateComponent({
//     description,
//   }: {
//     description: string;
//   }): Promise<any> {
//     const messages = [
//       { role: "system", content: GENERATE_FORM_PROMPT },
//       { role: "user", content: description },
//       {
//         role: "user",
//         content:
//           "Generate a React component in typescript based on the above description (last message), make sure to return your code inside a tsx/typescript markdown ```tsx <Your Code Here> ```",
//       },
//       {
//         role: "user",
//         content: `---
//           Instructions:
//           Make sure it's a working code, don't assume that I'm going to change or implement anything.
//           Assume I have React Typescript setup in my project.
//           Don't use any external libraries but @react-agent/shadcn-ui which is interal library, recharts for charts.
//           ---
//           Return Type:
//           return a React component, written in Typescript, using Tailwind CSS.
//           return the code inside tsx/typescript markdown \`\`\`tsx <Your Code Here> \`\`\`.`,
//       },
//     ] as any;
//     const response = await this.chatbot.getTypescriptResponse(messages);

//     return response;
//   }
// }