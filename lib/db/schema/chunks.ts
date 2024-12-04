import { nanoid } from "@/lib/utils";
import { index, pgTable, real, text, varchar, vector } from "drizzle-orm/pg-core";


export const chunk = pgTable("Chunk", {
    id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
    content: text("content").notNull(),
    // embedding: real("embedding").array().notNull(),
    embedding: vector("embedding", { dimensions: 768 }).notNull(),

  });
  