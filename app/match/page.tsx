import { Home } from "@/components/home"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "WoW Boss Memory Match - Warcraft Wits",
  description: "Challenge your WoW knowledge in this memory matching game. Match raid bosses to their instances and compete on the leaderboard!",
  openGraph: {
    title: "WoW Boss Memory Match - Warcraft Wits",
    description: "Challenge your WoW knowledge in this memory matching game. Match raid bosses to their instances, and compete on the leaderboard!",
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
    title: "WoW Boss Memory Match - Warcraft Wits",
    description: "Challenge your WoW knowledge in this memory matching game. Match raid bosses to their instances, and compete on the leaderboard!",
    images: ['/android-chrome-512x512.png'],
  }
}

export default function MatchPage() {
  return <Home />
}
