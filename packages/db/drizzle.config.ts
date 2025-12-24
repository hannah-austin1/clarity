import type { Config } from "drizzle-kit";

const baseUrl =
  process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;
if (!baseUrl) {
  throw new Error("Missing POSTGRES_URL or POSTGRES_URL_NON_POOLING");
}

// For Supabase pooler URLs, convert from transaction pooler to direct connection
// From: postgres.xxx:password@aws-x-region.pooler.supabase.com:6543
// To: postgres.xxx:password@aws-x-region.pooler.supabase.com:5432
let nonPoolingUrl = baseUrl;

// Prefer direct connection when available. If a pooler URL sneaks in, switch to 5432.
if (nonPoolingUrl.includes("pooler.supabase.com:6543")) {
  nonPoolingUrl = nonPoolingUrl.replace(":6543", ":5432");
} else if (nonPoolingUrl.includes(":6543")) {
  nonPoolingUrl = nonPoolingUrl.replace(":6543", ":5432");
}

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
  casing: "snake_case",
} satisfies Config;
