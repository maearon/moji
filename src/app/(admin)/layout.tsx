// app/admin/layout.tsx (Server Component)
import type { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "👕Admin Dashboard' adidas US %s | adidas US👕 admin Dashboard",
    description: "This is Next.js Signin Page TailAdmin Dashboard Shop the latest shoes, clothing, and accessories at adidas US.",
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/signin");

  if (user.role !== "admin") redirect("/signin");

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
