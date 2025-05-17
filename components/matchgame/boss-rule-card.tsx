import { Map } from "lucide-react"
import { RuleCard } from "./rule-card"

export function BossRuleCard() {
  const rules = [
    "Choose your favorite WoW expansion",
    "Type all or part of a boss name to score points",
    "Test your knowledge of raid and dungeon encounters",
    "Compete for the highest score on the leaderboard"
  ]

  return (
    <RuleCard
      icon={Map}
      title="Boss Memory Challenge"
      rules={rules}
    />
  )
}
