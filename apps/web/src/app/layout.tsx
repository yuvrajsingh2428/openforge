import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { NavMenu } from "@/components/nav-menu";
import { Anvil } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenForge - Meaningful Open Source Contributions",
  description: "Discover impactful open source projects based on your engineering growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <PostHogProvider>
              <div className="relative flex min-h-screen flex-col">
                <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
                    <div className="mr-4 flex items-center space-x-2">
                      <Anvil className="h-6 w-6" />
                      <span className="hidden font-bold sm:inline-block">OpenForge</span>
                    </div>
                    <div className="flex flex-1 items-center space-x-2 justify-between">
                      <NavMenu />
                    </div>
                  </div>
                </header>
                <main className="flex-1 container mx-auto px-4 py-8 max-w-screen-2xl">
                  {children}
                </main>
                <footer className="border-t border-border/40 py-6 md:py-0">
                  <div className="container flex flex-col md:flex-row items-center justify-between gap-4 max-w-screen-2xl mx-auto px-4 text-sm text-muted-foreground md:h-16">
                    <div className="flex items-center space-x-2">
                      <Anvil className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-foreground">OpenForge v1.0.0</span>
                      <span>— AI-Powered Open Source Recommendation & Mentor Platform</span>
                    </div>
                    <div className="flex items-center space-x-6">
                      <a
                        href="https://github.com/yuvrajsingh2428/openforge"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        GitHub
                      </a>
                      <a
                        href="/about"
                        className="hover:text-foreground transition-colors"
                      >
                        About
                      </a>
                    </div>
                  </div>
                </footer>
              </div>
            </PostHogProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
