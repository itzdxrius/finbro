
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveBudgetGoal } from '../lib/budget'

export default function Budget() {
  const [category, setCategory] = useState<string>('')
  const [monthlyLimit, setMonthlyLimit] = useState<string>('')

  async function handleSave() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('No logged-in user')
      return
    }

    try {
      await saveBudgetGoal(user.id, category, Number(monthlyLimit))
      setCategory('')
      setMonthlyLimit('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Navbar/>
      <h2>Budget Goals</h2>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Monthly limit"
        value={monthlyLimit}
        onChange={(e) => setMonthlyLimit(e.target.value)}
      />
      <button onClick={handleSave}>Save Goal</button>
      <Footer/>
    </div>
  )
}

