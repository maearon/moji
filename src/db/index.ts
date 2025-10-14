// apps/web/src/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not set in environment variables");
}

// 👉 phải tạo sql client bằng neon()
const sql = neon(process.env.DATABASE_URL);

// 👉 drizzle bọc sql client
export const db = drizzle(sql, { schema });
