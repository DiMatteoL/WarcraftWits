import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { SupabaseProvider } from "@/contexts/supabase-context"
import { ClientLayoutWrapper } from "@/components/client-layout-wrapper"
import GoogleAdsense from "@/components/GoogleAdsense"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Warcraft Wits - WoW Memory Game",
  description: "Test your knowledge of World of Warcraft bosses across all expansions. Challenge yourself to name as many raid and dungeon bosses as you can remember!",
  generator: 'v1.0.0',
  keywords: "World of Warcraft, WoW, boss memory game, raid bosses, dungeon bosses, Warcraft, gaming quiz, WoW quiz",
  authors: [{ name: "Rudnost" }],
  creator: "Rudnost",
  publisher: "Warcraft Wits",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://warcraftwits.com',
    title: 'Warcraft Wits - WoW Memory Game',
    description: 'Test your knowledge of World of Warcraft bosses across all expansions. Challenge yourself to name as many raid and dungeon bosses as you can remember!',
    siteName: 'Warcraft Wits',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Warcraft Wits Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warcraft Wits - World of Warcraft Boss Memory Game',
    description: 'Test your knowledge of World of Warcraft bosses across all expansions. Challenge yourself to name as many raid and dungeon bosses as you can remember!',
    creator: '@Rudnost',
    images: ['/android-chrome-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification', // You'll need to add your actual verification code
  },
  other: {
    'google-adsense-account': 'ca-pub-5164534018223080',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SupabaseProvider>
            <div className="min-h-screen bg-background">
              <div className="fixed top-4 right-4 z-50">
                <ModeToggle />
              </div>
              <ClientLayoutWrapper>
                {children}
              </ClientLayoutWrapper>
            </div>
          </SupabaseProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        <GoogleAdsense />
      </body>
    </html>
  )
}
