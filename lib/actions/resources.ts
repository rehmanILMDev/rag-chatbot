"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/db/schema/resources";
import { db } from "../db";
import { generateEmbeddings } from "../ai/embedding";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";
import { chunk } from "../db/schema/chunks";

export const createResource = async (input: NewResourceParams) => {
  try {
    // Validate and parse the input schema
    const { content } = insertResourceSchema.parse(input);
    console.log("Received content:", content);

    // Insert content into resources table
    // const [resource] = await db.insert(resources).values({ content }).returning();
    // console.log("Resource successfully created:", resource);

    // Generate embeddings for the inserted content
    try {
      if (!content || content.trim().length === 0) {
        throw new Error("Content is empty or invalid.");
      }
    
      const embeddings = await generateEmbeddings(content);
      console.log("Generated embeddings:", embeddings);
    
      if (embeddings.length === 0) {
        throw new Error("No embeddings generated. Cannot insert into the database.");
      }
    
      // await db.insert(embeddingsTable).values(
      //   embeddings.map((embedding) => ({
      //     resourceId: resource.id,
      //     ...embedding,
      //   }))
      // );
      // console.log("Embeddings successfully added for resource:", resource.id);
    } catch (embeddingError) {
      console.error("Error inserting embeddings:", embeddingError);
      throw new Error("Failed to create embeddings for the resource.");
    }
    

    // Return success message if everything went well
    return "Resource successfully created and embedded.";

  } catch (error) {
    // Capture and return specific error message
    console.error("Error in createResource:", error);
    return error instanceof Error ? error.message : "An unknown error occurred.";
  }
};



export async function insertChunks({ chunks }: { chunks: any[] }) {
  console.log(chunks, "hdhdthd chunks");
  
  return await db.insert(chunk).values(chunks);
}



export async function getChunks() {
  try {
    return await db.select().from(chunk);
  } catch (error) {
    console.error("Error fetching chunks:", error);
    throw new Error("Failed to fetch knowledge base chunks.");
  }
}
