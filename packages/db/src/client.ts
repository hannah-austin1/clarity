import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}

const client = postgres(process.env.POSTGRES_URL, {
  ssl: "require",
});

export const db = drizzle({
  client,
  schema,
  casing: "snake_case",
});
