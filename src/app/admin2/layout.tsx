import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/redux-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { LocationModalProvider } from "@/components/modal-providers";
import FeedbackWidget from "@/components/feedback-widget";
import ScrollToTop from "@/components/scroll-to-top";
import "mapbox-gl/dist/mapbox-gl.css";
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ToastProvider } from "@/components/ToastProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import { cookies } from "next/headers";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: {
    template: "adidas %s | adidas US",
    default: "adidas Online Shop | adidas US",
  },
  description: "Shop the latest adidas shoes, clothing and accessories",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const theme = cookieStore.get("theme")?.value || "light";
  return (
    <html lang={locale} className={theme} style={{ colorScheme: theme }} suppressHydrationWarning>
      <body
        className={`${barlow.variable}`}
      >
        <ReduxProvider>
          <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background">
              {/* Header - Always visible */}
              <AdminHeader />

              <div className="flex">
                {/* Desktop Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 md:ml-64 pb-16 md:pb-0">
                  <div className="pt-16">{children}</div>
                </main>
              </div>

              {/* Mobile Bottom Navigation */}
              <MobileBottomNav />
            </div>
            <LocationModalProvider />
            <FeedbackWidget />
            <ScrollToTop />
            <ToastProvider />
          </ThemeProvider>
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
};
