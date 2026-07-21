import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { supabase } from "../lib/supabase"
import { saveBudgetGoal } from "../lib/budget"
import { CATEGORIES } from "../lib/categories"

import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import "./setting.css"

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
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Account
            </p>
            <h1 className="font-heading text-2xl font-semibold">Settings</h1>
          </div>
        </div>
        <div className = "settings-content">
          <Card className="profile-card">
            <CardContent className="profile-card-content">
              <img
                src="/profile-picture.webp"
                alt="Profile"
                className="profile-card-image"
              />
              <p className="profile-card-email">E-mail Address: {name}</p>
            </CardContent>
          </Card>
          <Card className = "settings-card">
              <CardHeader>
                <CardTitle>Budget Goals</CardTitle>
              </CardHeader>
              <CardContent className = "settings-card-content">
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
                <Button onClick={handleSave}>Save Goal</Button>
              </CardContent>
            </Card>
          </div>
          <Footer />
        </Navbar>
      </div>
  )
}
