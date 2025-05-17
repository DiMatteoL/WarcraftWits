import { SquareStack } from "lucide-react"
import { RuleCard } from "./rule-card"

export function MatchRuleCard() {
  const rules = [
    "Pick a WoW expansion to test your knowledge",
    "Match each boss to their correct instance",
    "Choose from 8 possible instances per boss",
    "One wrong guess ends your run - aim for the high score!"
  ]

  return (
    <RuleCard
      icon={SquareStack}
      title="Instance Matcher Challenge"
      rules={rules}
    />
  )
}
