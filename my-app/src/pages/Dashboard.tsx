import { useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { supabase } from "../lib/supabase"
import { saveExpense } from "../lib/transaction"
import { CATEGORIES } from "../lib/categories"

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Dashboard() {
  const [merchantName, setMerchantName] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [date, setDate] = useState<string>(todayISO())
  const [category, setCategory] = useState<string>(CATEGORIES[0])

  async function handleAddExpense() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("No logged-in user")
      return
    }

    try {
      await saveExpense(user.id, merchantName, Number(amount), date, category)
      setMerchantName("")
      setAmount("")
      setDate(todayISO())
      setCategory(CATEGORIES[0])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Navbar />
      <h2>Add Expense</h2>
      <input
        type="text"
        placeholder="Merchant"
        value={merchantName}
        onChange={(e) => setMerchantName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button onClick={handleAddExpense}>Add Expense</button>
      <Footer />
    </div>
  )
}
