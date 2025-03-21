import Image from "next/image"
import Link from "next/link"
import { ExpansionCard } from "@/components/expansion-card"
import { Card, CardContent } from "@/components/ui/card"
import { getAllExpansions } from "@/lib/data"

export default function WoWMemoryGame() {
  // Get expansions from data file
  const expansions = getAllExpansions()

  return (
    <div className="container py-12 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-12">
        {/* WoW Logo */}
        <div className="w-32 h-32 mb-6 relative">
          <Image src="/wow-logo.png" alt="World of Warcraft Logo" fill className="object-contain" priority />
        </div>

        {/* Title */}
        <h1 className="text-center mb-4">WoW From Memory</h1>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground text-lg max-w-2xl mb-8">
          How well do you think you know your World of Warcraft bosses?
        </p>

        {/* Instructions */}
        <Card className="w-full max-w-2xl border border-border/40 shadow-md mb-8">
          <CardContent className="pt-6 pb-6">
            <p className="text-center text-card-foreground mb-4 text-lg">
              Pick your favorite expansion and type as many boss names you can remember, and see how well you fare.
            </p>

            {/* Enjoy text */}
            <p className="text-center text-primary font-medium text-lg">Enjoy!</p>
          </CardContent>
        </Card>
      </div>

      {/* Expansion Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {expansions.map((expansion) => (
          <Link href={`/expansion/${expansion.id}`} key={expansion.id}>
            <ExpansionCard name={expansion.name} image={expansion.image} />
          </Link>
        ))}
      </div>
    </div>
  )
}

