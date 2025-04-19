import { Brain } from "lucide-react"
import { RuleCard } from "./rule-card"

export function BossRuleCard() {
  const rules = [
    "Select your favorite expansion",
    "Name as many bosses as you can remember",
    "Your score increases with each correct boss name",
    "Try to beat your high score !"
  ]

  return (
    <RuleCard
      icon={Brain}
      title="How to Play Boss Memory"
      rules={rules}
    />
  )
}
