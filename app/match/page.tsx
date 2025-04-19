import { Home } from "@/components/home"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Match Game - Warcraft Wits",
  description: "Test your memory and match World of Warcraft bosses in this fun memory game. Challenge yourself to find all the matching pairs!",
  openGraph: {
    title: "Match Game - Warcraft Wits",
    description: "Test your memory and match World of Warcraft bosses in this fun memory game. Challenge yourself to find all the matching pairs!",
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
    title: "Match Game - Warcraft Wits",
    description: "Test your memory and match World of Warcraft bosses in this fun memory game. Challenge yourself to find all the matching pairs!",
    images: ['/android-chrome-512x512.png'],
  }
}

export default function MatchPage() {
  return <Home />
}
