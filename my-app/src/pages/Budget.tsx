import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { supabase } from "../lib/supabase"
import { getBudgets, type Budget } from "../lib/budget"
import { getSpendingByCategory } from "../lib/transaction"

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
        <h2>Budgets</h2>
        {budgets.map((budget) => {
          const spent = spending[budget.category] ?? 0
          return (
            <div key={budget.id}>
              <p>{budget.category}</p>
              <p>
                ${spent.toFixed(2)} of ${budget.monthly_limit.toFixed(2)}
              </p>
            </div>
          )
        })}
        <Footer />
      </Navbar>
    </div>
  )
}
