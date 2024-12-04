import { embed, embedMany } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { mistral } from '@ai-sdk/mistral';
import { db } from '../db';
import { cosineDistance, desc, gt, sql, and, or } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { v4 as uuidv4 } from 'uuid';
import { JinaEmbeddings } from "@langchain/community/embeddings/jina";
import { CharacterTextSplitter } from "@langchain/textsplitters";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { z } from 'zod';
import { createOpenAI, openai } from '@ai-sdk/openai';
import Groq from "groq-sdk";
import { resources } from '../db/schema/resources';
import { insertChunks } from '../actions/resources';
import { Content } from 'next/font/google';

// const nike10kPdfPath = "../../../../data/nke-10k-2023.pdf";

// const loader = new PDFLoader(nike10kPdfPath);
const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
});

const embeddingModel = ollama.embedding('nomic-embed-text:latest');


// const groq = new Groq();


// const generateChunks = async (input: string): Promise<Array<{ id: string; content: string; metadata: any }>> => {
//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//     chunkOverlap: 200,
//   });
  
//   const chunks = await splitter.createDocuments([input]);
  
//   return chunks.map(chunk => ({
//     id: uuidv4(),
//     content: chunk.pageContent,
//     metadata: {
//       ...chunk.metadata,
//       chunk_type: 'paragraph',
//     },
//   }));
// };

// export const processPDFAndGenerateEmbeddings = async (pdfPath: string) => {
//   const loader = new PDFLoader(pdfPath);
//   const pages = await loader.load();
  
//   const allChunks = [];
//   for (const page of pages) {
//     const pageChunks = await generateChunks(page.pageContent);
//     allChunks.push(...pageChunks.map(chunk => ({
//       ...chunk,
//       metadata: { ...chunk.metadata, page: page.metadata.page },
//     })));
//   }
  
//   const { embeddings: embeddedChunks } = await embedMany({
//     model: embeddingModel,
//     values: allChunks.map(chunk => chunk.content),
//   });
  
//   // Store chunks and embeddings in the database
//   for (let i = 0; i < allChunks.length; i++) {
//     await db.insert(embeddings).values({
//       id: allChunks[i].id,
//       content: allChunks[i].content,
//       embedding: embeddedChunks[i],
//       metadata: allChunks[i].metadata,
//     });
//   }
// };
// export const findRelevantContent = async (userQuery: string) => {
//   console.log("user query:", userQuery);
  
//   // Step 1: Get the user query embedding
//   const userQueryEmbedded = await embed({
//     model: embeddingModel,
//     value: userQuery,
//   });
//   console.log("user query embedding:", userQueryEmbedded.embedding);

//   // Ensure the embedding is an array of numbers
//   const embeddingArray = Array.isArray(userQueryEmbedded.embedding)
//     ? userQueryEmbedded.embedding
//     : Object.values(userQueryEmbedded.embedding);

//   console.log("embeddingArray:", embeddingArray);

//   // Step 2: Convert the embedding array to a string representation (this might need to be fixed for proper database comparison)
//   const embeddingString = `[${embeddingArray.join(',')}]`;
//   console.log("embeddingString:", embeddingString);

//   // Step 3: Build the semantic similarity and lexical match conditions
//   const semanticSimilarity = sql<number>`1 - cosine_distance(${embeddings.embedding}, ${embeddingString}::vector)`;
//   const sanitizedQuery = userQuery.trim().replace(/[^\w\s]/gi, '');
//   const lexicalMatch = sql<boolean>`embeddings.content ILIKE ${`%${sanitizedQuery}%`}`;
  
//   const hybridResults = await db
//     .select({
//       id: embeddings.id,
//       content: embeddings.content,
//       metadata: embeddings.metadata,
//       semanticScore: semanticSimilarity,
//       lexicalMatch,
//     })
//     .from(embeddings)
//     .where(
//       or(
//         gt(semanticSimilarity, 0.5),
//         lexicalMatch
//       )
//     )
//     .orderBy(desc(semanticSimilarity))
//     .limit(20);
  
//   console.log("Hybrid results:", hybridResults);
  


//   // Step 5: If no results are found, log and check conditions
//   if (hybridResults.length === 0) {
//     console.log("No results found with the given query conditions.");
//     console.log("Checking the parameters:");
//     console.log("semanticSimilarity threshold:", gt(semanticSimilarity, 0.7));
//     console.log("lexicalMatch condition:", lexicalMatch);
//   }

//   // Step 6: Rerank results using Groq LLaMA 3
//   if (hybridResults.length > 0) {
//     const rerankerPrompt = `You are a helpful assistant tasked with ranking search results based on their relevance to a given query. Rank the following results from most relevant (1) to least relevant, providing a brief explanation for each ranking.

//     Query: ${userQuery}

//     Results:
//     ${hybridResults.map((r, i) => `${i + 1}. ${r.content}`).join('\n')}

//     Provide your rankings in the format:
//     1. [result number]
//     2. [result number]
//     ...`;

//     // Step 7: Call Groq API for reranking
//     const rerankerResponse = await groq.chat.completions.create({
//       model: 'llama3-70b-8192',
//       messages: [{ role: 'user', content: rerankerPrompt }],
//       temperature: 0.2,
//       max_tokens: 1000,
//     });

//     console.log("Reranker response:", rerankerResponse.choices[0].message.content);

//     // Step 8: Parse the rankings from the reranker response
//     const rankingRegex = /(\d+)\.\s+(\d+)/g;
//     const rankings = [...rerankerResponse.choices[0].message.content.matchAll(rankingRegex)].map(match => parseInt(match[2]));

//     console.log("Rankings:", rankings);

//     // Step 9: Sort the results based on the rankings and return the top 4
//     const finalResults = rankings
//       .map((rank, index) => ({ rank, result: hybridResults[index] }))
//       .sort((a, b) => a.rank - b.rank)
//       .slice(0, 4)
//       .map(({ result }) => result);

//     console.log("Final results:", finalResults);

//     return finalResults;
//   } else {
//     return [];  // No results found
//   }
// };



// export const findRelevantContent = async (userQuery: string) => {
//   console.log("user query:", userQuery);
  
//   const userQueryEmbedded = await embed({
//     model: embeddingModel,
//     value: userQuery,
//   });
//   console.log("user query embedding:", userQueryEmbedded.embedding);

//   // Ensure the embedding is an array of numbers
//   const embeddingArray = Array.isArray(userQueryEmbedded.embedding) 
//     ? userQueryEmbedded.embedding 
//     : Object.values(userQueryEmbedded.embedding);

//   // Convert the embedding array to a string representation
//   const embeddingString = `[${embeddingArray.join(',')}]`;

//   const semanticSimilarity = sql<number>`1 - cosine_distance(${embeddings.embedding}, ${embeddingString}::vector)`;
//   const lexicalMatch = sql<boolean>`${embeddings.content} ILIKE ${`%${userQuery}%`}`;

//   const hybridResults = await db
//     .select({
//       id: embeddings.id,
//       content: embeddings.content,
//       metadata: embeddings.metadata,
//       semanticScore: semanticSimilarity,
//       lexicalMatch,
//     })
//     .from(embeddings)
//     .where(
//       or(
//         gt(semanticSimilarity, 0.7),
//         lexicalMatch
//       )
//     )
//     .orderBy(desc(semanticSimilarity))
//     .limit(20);

//   console.log("Hybrid results:", hybridResults);

//   // Reranking using Groq LLaMA 3
//   const rerankerPrompt = `You are a helpful assistant tasked with ranking search results based on their relevance to a given query. Rank the following results from most relevant (1) to least relevant, providing a brief explanation for each ranking.

// Query: ${userQuery}

// Results:
// ${hybridResults.map((r, i) => `${i + 1}. ${r.content}`).join('\n')}

// Provide your rankings in the format:
// 1. [result number]
// 2. [result number]
// ...`;

//   const rerankerResponse = await groq.chat.completions.create({
//     model: 'llama3-70b-8192',
//     messages: [{ role: 'user', content: rerankerPrompt }],
//     temperature: 0.2,
//     max_tokens: 1000,
//   });

//   console.log("Reranker response:", rerankerResponse.choices[0].message.content);

//   const rankingRegex = /(\d+)\.\s+(\d+)/g;
//   const rankings = [...rerankerResponse.choices[0].message.content.matchAll(rankingRegex)].map(match => parseInt(match[2]));

//   console.log("Rankings:", rankings);

//   const finalResults = rankings
//     .map((rank, index) => ({ rank, result: hybridResults[index] }))
//     .sort((a, b) => a.rank - b.rank)
//     .slice(0, 4)
//     .map(({ result }) => result);

//   console.log("Final results:", finalResults);

//   return finalResults;
// };

// export const generateRAGResponse = async (userQuery: string) => {
//   const relevantContent = await findRelevantContent(userQuery);
  
//   // const context = relevantContent
//   //   .map(item => `Content: ${item.content}\nMetadata: ${JSON.stringify(item.metadata)}`)
//   //   .join('\n\n');

//   // const response = await groq.chat.completions.create({
//   //   model: 'llama3-70b-8192',
//   //   messages: [
//   //     { role: 'system', content: 'You are a helpful assistant. Use the provided context to answer the user\'s question. If you cannot find the answer in the context, say so.' },
//   //     { role: 'user', content: `Context:\n${context}\n\nQuestion: ${userQuery}` },
//   //   ],
//   //   temperature: 0.7,
//   //   max_tokens: 1000,
//   // });

//   return relevantContent;
// };

// const insertResourceSchema = z.object({
//   content: z.string(),
//   filePath: z.string().optional(),
// });

// type NewResourceParams = z.infer<typeof insertResourceSchema>;

// export const createResource = async (input: NewResourceParams) => {
//   try {
//     const { content, filePath } = insertResourceSchema.parse(input);
//     console.log("Received content:", content);

//     const [resource] = await db.insert(resources).values({ content }).returning();
//     console.log("Resource successfully created:", resource);

//     try {
//       if (filePath) {
//         await processPDFAndGenerateEmbeddings(filePath);
//         console.log("PDF processed and embeddings generated for resource:", resource.id);
//       } else {
//         const chunks = await generateChunks(content);
//         const { embeddings: embeddedChunks } = await embedMany({
//           model: embeddingModel,
//           values: chunks.map(chunk => chunk.content),
//         });
//         console.log("embeded chunks successfulyy created: ",embeddedChunks);
        
//         await db.insert(embeddings).values(
//           chunks.map((chunk, index) => ({
//             resourceId: resource.id,
//             content: chunk.content,
//             embedding: embeddedChunks[index],
//             metadata: chunk.metadata,
//           }))
//         );
//         console.log("Embeddings successfully added for resource:", resource.id);
//       }
//     } catch (embeddingError) {
//       console.error("Error processing PDF or inserting embeddings:", embeddingError);
//       throw new Error("Failed to process PDF or create embeddings for the resource.");
//     }

//     return "Resource successfully created and embedded.";
//   } catch (error) {
//     console.error("Error in createResource:", error);
//     return error instanceof Error ? error.message : "An unknown error occurred.";
//   }
// };



// const generateChunks = (input: string): string[] => {
//   return input
//     .trim()
//     .split('.')
//     .filter(i => i !== '');
// };

// export const generateEmbeddings = async (
//     value: string,
//   ): Promise<Array<{ embedding: number[]; content: string }>> => {
//     const chunks = generateChunks(value);
//     const { embeddings } = await embedMany({
//       model: embeddingModel,
//       values: chunks,
//     });
//     // for checking embedding dimensions error
//     // embeddings.forEach((e, i) => {
//     //   console.log(`Embedding ${i} dimensions: ${e.length}`);
//     // });
//     return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
//   };
  
//   export const generateEmbedding = async (value: string): Promise<number[]> => {
//     const input = value.replaceAll('\\n', ' ');
//     const { embedding } = await embed({
//       model: embeddingModel,
//       value: input,
//     });
//     return embedding;
//   };
  

// export const findRelevantContent = async (userQuery: string) => {
//   console.log(userQuery, "gcvct");
  
//   const userQueryEmbedded = await generateEmbedding(userQuery);
//   console.log(userQueryEmbedded, "vvj");
  
//   const similarity = sql<number>`1 - (${cosineDistance(
//     embeddings.embedding,
//     userQueryEmbedded,
//   )})`;
//   const similarGuides = await db
//     .select({ name: embeddings.content, similarity })
//     .from(embeddings)
//     .where(gt(similarity, 0.5))
//     .orderBy(t => desc(t.similarity))
//     .limit(4);
//   return similarGuides;
// };

// const generateChunks = (input: string): string[] => {
//   return input
//     .trim()
//     .split('.')
//     .filter(i => i !== '');
// };


// Helper to clean and chunk text more robustly
// const generateChunks = (input: string): string[] => {
//   return input
//     .trim()
//     .replace(/[\r\n]+/g, ' ') // Replace newlines with spaces
//     .split(/[.!?]/) // Split by sentence-ending punctuation
//     .map(chunk => chunk.trim())
//     .filter(chunk => chunk.length > 60); // Avoid very short chunks
// };


const embeddingsjina = new JinaEmbeddings();

// async function runExample() {
  // const queryEmbedding = await embeddingsjina.embedQuery("Example query text.");
  // console.log("Query Embedding:", queryEmbedding);

  // const documents = ["Text 1", "Text 2", "Text 3"];
  // const documentEmbeddings = await embeddingsjina.embedDocuments(documents);
  // console.log("Document Embeddings:", documentEmbeddings);
// }
const textSplitter = new CharacterTextSplitter({
  chunkSize: 1000
});
const recursiveSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000
});


// export const generateEmbeddings = async (
//   value: string,
// ): Promise<Array<{ embedding: number[]; content: string }>> => {
//   const chunkedContent = await recursiveSplitter.createDocuments([value]);

//   const { embeddings } = await embedMany({
//     model: embeddingModel,
//     values: chunkedContent.map((chunk) => chunk.pageContent),
//   });
// console.log(embeddings, "dndndndndn");
// console.log(embeddings.length, "lengthhh");

//   try {
//     const formattedVector = embeddings.map((embedding) => `{${embedding.join(',')}}`);

//     await insertChunks({
//       chunks: chunkedContent.map((chunk, i) => ({
//         id: uuidv4(),
//         content: chunk.pageContent,
//         embedding: embeddings[i], // Pass as an array, or formattedVector[i] if needed
//       })),
//     });
//     console.log("Embeddings successfully added for resource:");
//   } catch (embeddingError) {
//     console.error("Error inserting embeddings:", embeddingError);
//     throw new Error("Failed to create embeddings for the resource.");
//   }

//   console.log("successfully created embedding");
//   return []
// };


export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> =>  {
  const chunkedContent = await recursiveSplitter.createDocuments([value]);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunkedContent.map((chunk) => chunk.pageContent),
  });

  const fixedDimension = 768; // Set your dimension size here
  const formattedEmbeddings = embeddings.map(embedding => {
    // Adjust to fixed dimension
    const adjusted = embedding.length > fixedDimension
      ? embedding.slice(0, fixedDimension)
      : [...embedding, ...Array(fixedDimension - embedding.length).fill(0)];
    return adjusted.join(','); // Convert to comma-separated string
  });

  if (Array.isArray(chunkedContent) && Array.isArray(formattedEmbeddings)) {
    try {
      await insertChunks({
        chunks: chunkedContent.map((chunk, i) => ({
          id: uuidv4(),
          content: chunk.pageContent,
          embedding: embeddings[i],
        })),
      });
      console.log("Embeddings successfully added for resource");
    } catch (embeddingError) {
      console.error("Error inserting embeddings:", embeddingError);
      throw new Error("Failed to create embeddings for the resource.");
    }
  } else {
    console.error("Invalid data: chunkedContent or formattedEmbeddings is not an array.");
  }
  
  console.log("Successfully created embedding");
  return [];
};


//   // Ensure embeddings align with their respective chunks
//   const documentEmbeddings = await embeddingsjina.embedDocuments(texts).catch((err) => {
//     console.error("Error generating embeddings:", err);
//     throw new Error("Embedding service failed.");
//   });
//     console.log("Document Embeddings:", documentEmbeddings);
//   return documentEmbeddings.map((e, i) => ({ content: texts[i], embedding: e }));
//   return []
// };



export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value
    .replace(/[\r\n]+/g, ' ') // Normalize text
    .trim();

    const embedding = await embeddingsjina.embedQuery(
     input
    );
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);

  // Calculate similarity using cosine distance
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;

  const similarGuides = await db
    .select({ content: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.7)) // Increase the threshold for more accurate matches
    .orderBy(t => desc(t.similarity))
    .limit(4);

  return similarGuides;
};
