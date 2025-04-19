import Image from "next/image"
import { ExpansionTable } from "@/components/expansion-table"
import { Footer } from "@/components/footer"
import { GamePicker } from "@/components/matchgame/game-picker"

export function Home() {
  return (
    <>
    <div className="container py-4 md:py-12 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-12">
        {/* WoW Logo */}
        <div className="w-32 h-32 mb-6 relative">
          <Image src="/android-chrome-192x192.png" alt="WarcraftWits Logo" fill className="object-contain" priority />
        </div>

        {/* Title */}
        <h1 className="text-center mb-4">Warcraft Wits</h1>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground text-lg max-w-2xl mb-8">
          How many bosses can you name from your favorite WoW expansion?
        </p>

        {/* Instructions */}
        <GamePicker />
      </div>

      <ExpansionTable />
    </div>
    <Footer />
    </>
  )
}
