import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ExpansionTable } from "@/components/expansion-table"
import { Footer } from "@/components/footer"

export default function WoWMemoryGame() {
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
        <Card className="w-full max-w-2xl border border-border/40 shadow-md mb-8">
          <CardContent className="pt-6 pb-6">
            <p className="text-center text-card-foreground mb-4 text-lg">
              Choose your expansion and see how many encounters you can recall.
              From Onyxia to Gallywix, prove you're a true WoW veteran.
            </p>

            <p className="text-center font-medium text-lg">Enjoy!</p>
          </CardContent>
        </Card>
      </div>

      {/* Expansion Grid - Now using Supabase data */}
      <ExpansionTable />
    </div>
    <Footer />
    </>
  )
}
