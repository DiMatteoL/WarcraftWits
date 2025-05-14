import { Home } from "@/components/home"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Warcraft Wits - WoW Boss Memory Challenge",
  description: "Test your World of Warcraft knowledge in this competitive memory game. Climb the leaderboards, and put those thousands of in game played hours to the test!",
  openGraph: {
    title: "Warcraft Wits - WoW Boss Memory Challenge",
    description: "Test your World of Warcraft knowledge in this competitive memory game. Climb the leaderboards, and put those thousands of in game played hours to the test!",
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
    title: "Warcraft Wits - WoW Boss Memory Challenge",
    description: "Test your World of Warcraft knowledge in this competitive memory game. Climb the leaderboards, and put those thousands of in game played hours to the test!",
    images: ['/android-chrome-512x512.png'],
  }
}

export default function WoWMemoryGame() {
  return <Home />
}
