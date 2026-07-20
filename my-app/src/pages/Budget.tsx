import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { supabase } from "../lib/supabase"
import { getBudgets, type Budget } from "../lib/budget"
import { getSpendingByCategory } from "../lib/transaction"
import { BudgetCard } from "@/pages/BudgetCard"
import {
  ShoppingCart,
  Car,
  UtensilsCrossed,
  Drama,
  Home,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react"
import "./budgetcard.css"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Groceries: ShoppingCart,
  Transportation: Car,
  Dining: UtensilsCrossed,
  Entertainment: Drama,
  Housing: Home,
  Misc: MoreHorizontal,
}

export default function Budget() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [spending, setSpending] = useState<Record<string, number>>({})
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      try {
        const [budgetData, spendingData] = await Promise.all([
          getBudgets(user.id),
          getSpendingByCategory(user.id),
        ])

        if (budgetData.length === 0) {
          navigate("/setting")
          return
        }

        setBudgets(budgetData)
        setSpending(spendingData)
      } catch (error) {
        console.error(error)
      }
    }

    load()
  }, [navigate])

  return (
    <div>
      <Navbar>
        <div className="budget-content">
          <h2>Budget Goals</h2>
          <div className="budget-grid">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                icon={CATEGORY_ICONS[budget.category] ?? MoreHorizontal}
                category={budget.category}
                target={budget.monthly_limit}
                spent={spending[budget.category] ?? 0}
              />
            ))}
          </div>
        </div>
        <Footer />
      </Navbar>
    </div>
  )
}
