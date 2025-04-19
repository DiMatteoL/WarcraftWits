import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RuleCardProps {
  icon: LucideIcon
  title: string
  rules: string[]
}

export function RuleCard({ icon: Icon, title, rules }: RuleCardProps) {
  return (
    <Card className="border border-border/40 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground ml-4">
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          {rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
