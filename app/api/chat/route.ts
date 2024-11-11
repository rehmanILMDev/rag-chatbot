import { createResource } from "@/lib/actions/resources";
import { mistral } from "@ai-sdk/mistral";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, generateObject, streamText, tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/lib/ai/embedding";

import { createOllama } from "ollama-ai-provider";

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
  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });

  const result = await streamText({
    model: groq("llama3-groq-70b-8192-tool-use-preview"),
    messages: convertToCoreMessages(messages),
    system: `You are a helpful assistant acting as the users' second brain.
      Use tools on every request.
      Be sure to getInformation from your knowledge base before answering any questions.
      If the user presents information about themselves, use the addResource tool to store it.
      If a response requires multiple tools, call one tool after another without responding to the user.
      If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user.
      ONLY respond to questions using information from tool calls.
      if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
      Be sure to adhere to any instructions in tool calls i.e., if they say to respond like "...", do exactly that.
      Keep responses short and concise. Answer in a single sentence where possible.
      If you are unsure, use the getInformation tool and you can use common sense to reason based on the information you do have.
    `,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => {
          console.log("addResource called with content:", content);
          try {
            return await createResource({ content });
          } catch (error) {
            console.error("addResource failed:", error);
          }
        },
      }),

      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the user's question"),
          similarQuestions: z.array(z.string()).describe("keywords to search"),
        }),
        execute: async ({ question, similarQuestions }) => {
          console.log("getInformation called with question:", question, "and similarQuestions:", similarQuestions);
          try {
            const results = await Promise.all(
              similarQuestions.map(async (question) => await findRelevantContent(question))
            );
            const uniqueResults = Array.from(new Map(results.flat().map((item) => [item?.name, item])).values());
            console.log("getInformation results:", uniqueResults);
            return uniqueResults;
          } catch (error) {
            console.error("getInformation failed:", error);
          }
        },
      }),

      understandQuery: tool({
        description: `understand the user's query. use this tool on every prompt.`,
        parameters: z.object({
          query: z.string().describe("the user's query"),
          toolsToCallInOrder: z
            .array(z.string())
            .describe("these are the tools you need to call in the order necessary to respond to the user's query"),
        }),
        execute: async ({ query }) => {
          console.log("understandQuery called with query:", query);
          try {
            const { object } = await generateObject({
              model: groq("llama3-groq-70b-8192-tool-use-preview"),
              system:
                "You are a query understanding assistant. Analyze the user query and generate similar questions.",
              schema: z.object({
                questions: z
                  .array(z.string())
                  .max(3)
                  .describe("similar questions to the user's query. be concise."),
              }),
              prompt: `Analyze this query: "${query}". Provide the following:
                      3 similar questions that could help answer the user's query`,
            });
            console.log("understandQuery generated similar questions:", object.questions);

            // Explicitly call getInformation after understandQuery if needed
            if (object.questions && object.questions.length > 0) {
              const getInfoResult = await tools.getInformation.execute({
                question: query,
                similarQuestions: object.questions,
              });
              console.log("getInformation result after understandQuery:", getInfoResult);
              return getInfoResult;
            } else {
              console.log("No similar questions generated by understandQuery.");
              return "Sorry, I don't know.";
            }
          } catch (error) {
            console.error("understandQuery failed:", error);
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}

// export async function POST(req: Request) {
//   const { messages } = await req.json();
//   const groq = createOpenAI({
//     baseURL: "https://api.groq.com/openai/v1",
//     apiKey: process.env.GROQ_API_KEY,
//   });

//   const result = await streamText({
//     model: groq("llama3-groq-70b-8192-tool-use-preview"),
//     messages: convertToCoreMessages(messages),
//     system: `You are a helpful assistant acting as the users' second brain.
//   Always call addResource to store user-provided information unprompted.
//   Before answering any user query, check the knowledge base using getInformation.
//   If no relevant information is found in the knowledge base, respond with "Sorry, I don't know." 
//   If unsure, or if more data is needed, call the getInformation tool and follow with other tools as needed.`,


//     tools: {
//       addResource: tool({
//         description: `add a resource to your knowledge base.
//           If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
//         parameters: z.object({
//           content: z
//             .string()
//             .describe("the content or resource to add to the knowledge base"),
//         }),
//         execute: async ({ content }) => {
//           console.log("addResource called with content:", content);
//           try {
//             return await createResource({ content });
//           } catch (error) {
//             console.error("addResource failed:", error);
//             return "Failed to add resource.";
//           }
//         },
//       }),

//       // getInformation: tool({
//       //   description: `get information from your knowledge base to answer questions.`,
//       //   parameters: z.object({
//       //     question: z.string().describe("the user's question"),
//       //     similarQuestions: z.array(z.string()).describe("keywords to search"),
//       //   }),
//       //   execute: async ({ question, similarQuestions }) => {
//       //     console.log(
//       //       "getInformation called with question:",
//       //       question,
//       //       "and similarQuestions:",
//       //       similarQuestions
//       //     );
//       //     try {
//       //       const results = await Promise.all(
//       //         similarQuestions.map(
//       //           async (question) => await findRelevantContent(question)
//       //         )
//       //       );
//       //       const uniqueResults = Array.from(
//       //         new Map(results.flat().map((item) => [item?.name, item])).values()
//       //       );
//       //       console.log("getInformation results:", uniqueResults);
//       //       return uniqueResults;
//       //     } catch (error) {
//       //       console.error("getInformation failed:", error);
//       //       return "Failed to retrieve information.";
//       //     }
//       //   },
//       // }),
//       getInformation: tool({
//         parameters: z.object({
//           question: z.string().describe("the user's question"),
//           similarQuestions: z.array(z.string()).describe("keywords to search"),
//         }),
//         execute: async ({ question, similarQuestions }) => {
//           console.log("Attempting to retrieve information for:", question);
//           console.log("With similar questions:", similarQuestions);
      
//           if (similarQuestions.length === 0) {
//             console.log("No similar questions were generated for:", question);
//             return "Sorry, I don't know.";
//           }
      
//           try {
//             const results = await Promise.all(
//               similarQuestions.map(async (similarQuestion: string) => await findRelevantContent(similarQuestion))
//             );
      
//             if (results.length === 0) {
//               console.log("No relevant information found for:", question);
//             } else {
//               console.log("getInformation results:", results);
//             }
      
//             return results.length > 0 ? results : "Sorry, I don't know.";
//           } catch (error) {
//             console.error("getInformation failed:", error);
//             return "Failed to retrieve information.";
//           }
//         },
//       }),
      
      
      
//       // understandQuery: tool({
//       //   description: `understand the user's query. use this tool on every prompt.`,
//       //   parameters: z.object({
//       //     query: z.string().describe("the user's query"),
//       //     toolsToCallInOrder: z
//       //       .array(z.string())
//       //       .describe("these are the tools you need to call in the order necessary to respond to the user's query"),
//       //   }),
//       //   execute: async ({ query }, { getInformation }) => {
//       //     console.log("understandQuery called with query:", query);
//       //     try {
//       //       const { object } = await generateObject({
//       //         model: groq("llama3-groq-70b-8192-tool-use-preview"),
//       //         system:
//       //           "You are a query understanding assistant. Analyze the user query and generate similar questions.",
//       //         schema: z.object({
//       //           questions: z
//       //             .array(z.string())
//       //             .max(3)
//       //             .describe("similar questions to the user's query. be concise."),
//       //         }),
//       //         prompt: `Analyze this query: "${query}". Provide the following:
//       //                 3 similar questions that could help answer the user's query`,
//       //       });
//       //       console.log("understandQuery generated similar questions:", object.questions);

//       //       // Explicitly call getInformation after understandQuery if needed
//       //       if (object.questions && object.questions.length > 0) {
//       //         const getInfoResult = await getInformation.execute({
//       //           question: query,
//       //           similarQuestions: object.questions,
//       //         });
//       //         console.log("getInformation result after understandQuery:", getInfoResult);
//       //         return getInfoResult;
//       //       } else {
//       //         console.log("No similar questions generated by understandQuery.");
//       //         return "Sorry, I don't know.";
//       //       }
//       //     } catch (error) {
//       //       console.error("understandQuery failed:", error);
//       //       return "Failed to understand query.";
//       //     }
//       //   },
//       // }),
//     },
//   });

//   return result.toDataStreamResponse();
// }

// // Main flow control
// async function mainFlow(query) {
//   console.log("Starting main flow with query:", query);

//   // Step 1: Understand the query
//   const similarQuestions = await tools.understandQuery.execute({ query });
//   console.log("Similar questions generated:", similarQuestions);

//   // Step 2: Call getInformation if necessary
//   if (similarQuestions && similarQuestions.length > 0) {
//     const results = await tools.getInformation.execute({
//       question: query,
//       similarQuestions: similarQuestions,
//     });
//     console.log("getInformation results:", results);

//     // Optionally: Use addResource based on context
//     if (results.some((item) => item.isNew)) {
//       const contentToAdd = results.filter((item) => item.isNew).map((item) => item.content).join(" ");
//       await tools.addResource.execute({ content: contentToAdd });
//       console.log("Resource added:", contentToAdd);
//     }

//     return results;
//   } else {
//     console.log("No similar questions found. Ending flow.");
//     return "Sorry, I don't know.";
//   }
// }

// // Invoke the main flow
// await mainFlow("Your question or query here");
