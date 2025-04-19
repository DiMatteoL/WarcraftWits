import { Home } from "@/components/home"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Warcraft Wits - WoW Memory Game",
  description: "Test your knowledge of World of Warcraft bosses across all expansions. Challenge yourself to name as many raid and dungeon bosses as you can remember!",
  openGraph: {
    title: "Warcraft Wits - WoW Memory Game",
    description: "Test your knowledge of World of Warcraft bosses across all expansions. Challenge yourself to name as many raid and dungeon bosses as you can remember!",
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
    title: "Warcraft Wits - WoW Memory Game",
    description: "Test your knowledge of World of Warcraft bosses across all expansions. Challenge yourself to name as many raid and dungeon bosses as you can remember!",
    images: ['/android-chrome-512x512.png'],
  }
}

export default function WoWMemoryGame() {
  return <Home />
}
