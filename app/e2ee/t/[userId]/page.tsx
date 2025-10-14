import { type Session } from "@/lib/auth"
import { getServerSession } from "@/lib/get-session";
import ChatPageClient from "./ChatPageClient";

export default async function Footer() {
  const session: Session | null = await getServerSession() // Session type-safe
  return <ChatPageClient session={session} />
}
