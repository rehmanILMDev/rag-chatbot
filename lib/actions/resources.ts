"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/db/schema/resources";
import { db } from "../db";
import { generateEmbeddings } from "../ai/embedding";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";

export const createResource = async (input: NewResourceParams) => {
  try {
    // Validate and parse the input schema
    const { content } = insertResourceSchema.parse(input);
    console.log("Received content:", content);

    // Insert content into resources table
    const [resource] = await db.insert(resources).values({ content }).returning();
    console.log("Resource successfully created:", resource);

    // Generate embeddings for the inserted content
    try {
      const embeddings = await generateEmbeddings(content);
      await db.insert(embeddingsTable).values(
        embeddings.map((embedding) => ({
          resourceId: resource.id,
          ...embedding,
        }))
      );
      console.log("Embeddings successfully added for resource:", resource.id);
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
