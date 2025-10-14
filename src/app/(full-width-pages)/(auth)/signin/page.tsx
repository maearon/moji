import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "👕Admin Dashboard' adidas US | adidas US👕 admin Dashboard",
    description: "This is Next.js Signin Page TailAdmin Dashboard Shop the latest shoes, clothing, and accessories at adidas US.",
  };
}

export default async function SignIn() {
  const session = await getServerSession();
  const user = session?.user;

  if (user) redirect("/");

  return <SignInForm />;
}
