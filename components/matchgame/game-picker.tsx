"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, MapPin } from "lucide-react"

export function GamePicker() {
  const pathname = usePathname()
  const isMatchRoute = pathname === "/match"

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
        {/* Memory Game */}
        <Card className={`overflow-hidden border border-border/40 shadow-md transition-all duration-300 hover:shadow-lg ${!isMatchRoute ? 'border-primary' : ''}`}>
          <CardHeader className="p-6 pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Boss Memory</span>
            </CardTitle>
            <CardDescription className="text-center">
              How many boss names can you remember from each expansion?
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Test your memory by naming as many raid and dungeon bosses as you can from each WoW expansion.
            </p>
            <Link href="/" className="w-full">
              <Button className="w-full" variant={!isMatchRoute ? "default" : "outline"}>Play Memory Game</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Instance Matcher Game */}
        <Card className={`overflow-hidden border border-border/40 shadow-md transition-all duration-300 hover:shadow-lg ${isMatchRoute ? 'border-primary' : ''}`}>
          <CardHeader className="p-6 pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Instance Matcher</span>
            </CardTitle>
            <CardDescription className="text-center">
              Can you match each boss to their correct instance?
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Test your knowledge by matching randomly selected bosses to their correct dungeon or raid instance.
            </p>
            <Link href="/match" className="w-full">
              <Button className="w-full" variant={isMatchRoute ? "default" : "outline"}>Play Instance Matcher</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
  )
}
