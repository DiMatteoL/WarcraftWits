import { MapPin } from "lucide-react"
import { RuleCard } from "./rule-card"

export function MatchRuleCard() {
  const rules = [
    "Select your favorite expansion",
    "You'll be shown a random boss from that expansion",
    "Select the instance where this boss can be found",
    "Each correct answer earns you 1 point",
    "One wrong answer ends the game",
    "Try to beat your high score!"
  ]

  return (
    <RuleCard
      icon={MapPin}
      title="How to Play Instance Matcher"
      rules={rules}
    />
  )
}
