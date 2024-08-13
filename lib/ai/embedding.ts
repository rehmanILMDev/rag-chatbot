import { embed, embedMany } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { mistral } from '@ai-sdk/mistral';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';

const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
});

const embeddingModel = ollama.embedding('nomic-embed-text');


const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

export const generateEmbeddings = async (
    value: string,
  ): Promise<Array<{ embedding: number[]; content: string }>> => {
    const chunks = generateChunks(value);
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunks,
    });
    // for checking embedding dimensions error
    // embeddings.forEach((e, i) => {
    //   console.log(`Embedding ${i} dimensions: ${e.length}`);
    // });
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
  };
  
  export const generateEmbedding = async (value: string): Promise<number[]> => {
    const input = value.replaceAll('\\n', ' ');
    const { embedding } = await embed({
      model: embeddingModel,
      value: input,
    });
    return embedding;
  };
  

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);
  return similarGuides;
};







// import { db } from '../db';
// import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
// import { embeddings } from '../db/schema/embeddings';

// // Function to send HTTP POST request to the local embedding API
// const fetchEmbedding = async (input: string): Promise<number[] | null> => {
//   try {
//     const response = await fetch('http://localhost:11434/api/embed', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'nomic-embed-text',
//         input: input,
//       }),
//     });

//     if (!response.ok) {
//       console.error(`Failed to fetch embedding for input: ${input}`);
//       return null;
//     } else {
//         console.log("succuss run embedding.");
//         return null;
//     }

//     const data = await response.json();
//     return data.embedding || null;
//   } catch (error) {
//     console.error(`Error fetching embedding: ${error}`);
//     return null;
//   }
// };

// const generateChunks = (input: string): string[] => {
//   return input
//     .trim()
//     .split('.')
//     .filter(i => i !== '');
// };

// export const generateEmbeddings = async (
//   value: string,
// ): Promise<Array<{ embedding: number[]; content: string }>> => {
//   const chunks = generateChunks(value);
//   const embeddings = await Promise.all(
//     chunks.map(async (chunk) => {
//       const embedding = await fetchEmbedding(chunk);
//       if (embedding) {
//         return { content: chunk, embedding };
//       }
//       return null;
//     })
//   );

//   // Filter out any null results
//   return embeddings.filter(e => e !== null) as Array<{ embedding: number[]; content: string }>;
// };

// export const generateEmbedding = async (value: string): Promise<number[] | null> => {
//   const input = value.replaceAll('\\n', ' ');
//   return await fetchEmbedding(input);
// };

// export const findRelevantContent = async (userQuery: string) => {
//   const userQueryEmbedded = await generateEmbedding(userQuery);
//   if (!userQueryEmbedded) {
//     console.error("Failed to generate embedding for user query");
//     return [];
//   }

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
