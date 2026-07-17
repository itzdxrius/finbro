import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import "./budgetcard.css"

type BudgetStatus = "on-track" | "warning" | "over-limit"

interface BudgetCardProps {
  icon: LucideIcon
  category: string
  target: number
  spent: number
}

function getStatus(percentUsed: number): BudgetStatus {
  if (percentUsed > 100) return "over-limit"
  if (percentUsed >= 80) return "warning"
  return "on-track"
}

const statusConfig: Record<
  BudgetStatus,
  { label: string; badgeClass: string; iconClass: string; amountClass: string; indicatorClass: string }
> = {
  "on-track": {
    label: "ON TRACK",
    badgeClass: "budget-card-badge-ok",
    iconClass: "",
    amountClass: "",
    indicatorClass: "budget-card-indicator-ok",
  },
  warning: {
    label: "WARNING",
    badgeClass: "budget-card-badge-alert",
    iconClass: "",
    amountClass: "",
    indicatorClass: "budget-card-indicator-warning",
  },
  "over-limit": {
    label: "OVER LIMIT",
    badgeClass: "budget-card-badge-alert",
    iconClass: "budget-card-icon-alert",
    amountClass: "budget-card-amount-alert",
    indicatorClass: "budget-card-indicator-alert",
  },
}

export function BudgetCard({ icon: Icon, category, target, spent }: BudgetCardProps) {
  const percentUsed = Math.round((spent / target) * 100)
  const status = getStatus(percentUsed)
  const config = statusConfig[status]

  return (
    <Card className={status === "over-limit" ? "budget-card-over-limit" : undefined}>
      <CardContent className="budget-card-content">
        <div className="budget-card-header">
          <div className="budget-card-info">
            <div className={`budget-card-icon ${config.iconClass}`}>
              <Icon className="budget-card-icon-glyph" />
            </div>
            <div>
              <p className="budget-card-category">{category}</p>
              <p className="budget-card-target">Target: ${target.toFixed(2)}</p>
            </div>
          </div>
          <span className={`budget-card-badge ${config.badgeClass}`}>
            {config.label}
          </span>
        </div>

        <div className="budget-card-stats">
          <span className={`budget-card-amount ${config.amountClass}`}>
            ${spent.toFixed(2)}
          </span>
          <span className="budget-card-percent">{percentUsed}% used</span>
        </div>

        <Progress value={Math.min(percentUsed, 100)}>
          <ProgressTrack>
            <ProgressIndicator className={config.indicatorClass} />
          </ProgressTrack>
        </Progress>
      </CardContent>
    </Card>
  )
}
