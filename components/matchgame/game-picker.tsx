"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, MapPin } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BossRuleCard } from "./boss-rule-card"
import { MatchRuleCard } from "./match-rule-card"

export function GamePicker() {
  const pathname = usePathname()
  const isMatchRoute = pathname === "/match"

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue={isMatchRoute ? "match" : "memory"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <Link href="/" className="w-full">
            <TabsTrigger value="memory" className="w-full flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Boss Memory</span>
            </TabsTrigger>
          </Link>
          <Link href="/match" className="w-full">
            <TabsTrigger value="match" className="w-full flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Instance Matcher</span>
            </TabsTrigger>
          </Link>
        </TabsList>
        <TabsContent value="memory" className="mt-4">
          <BossRuleCard />
        </TabsContent>
        <TabsContent value="match" className="mt-4">
          <MatchRuleCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
