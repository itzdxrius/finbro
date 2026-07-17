import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { supabase } from "../lib/supabase"
import { saveBudgetGoal } from "../lib/budget"
import { CATEGORIES } from "../lib/categories"

export default function Setting() {
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [monthlyLimit, setMonthlyLimit] = useState<string>("")
  const [name, setName] = useState<string>("")

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setName(user.user_metadata.name ?? user.email ?? "")
      }
    }

    loadProfile()
  }, [])

  async function handleSave() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("No logged-in user")
      return
    }

    try {
      await saveBudgetGoal(user.id, category, Number(monthlyLimit))
      setCategory(CATEGORIES[0])
      setMonthlyLimit("")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Navbar>
        <h1>{name}</h1>
        <h2>Budget Goals</h2>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Monthly limit"
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
        />
        <button onClick={handleSave}>Save Goal</button>
        <Footer />
      </Navbar>
    </div>
  )
}
