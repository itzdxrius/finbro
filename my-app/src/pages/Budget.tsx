
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveBudgetGoal } from '../lib/budget'

import {BudgetCard} from "@/pages/BudgetCard"
import {ShoppingCart, Car, ShoppingBag, UtensilsCrossed, Zap, Drama} from "lucide-react"
import "./budgetcard.css"

const budgets = [
  { icon: ShoppingCart, category: "Groceries", target: 800, spent: 420.5 },
  { icon: Car, category: "Transport", target: 350, spent: 318 },
  { icon: ShoppingBag, category: "Shopping", target: 400, spent: 512.45 },
  { icon: UtensilsCrossed, category: "Dining", target: 600, spent: 180 },
  { icon: Zap, category: "Utilities", target: 450, spent: 345 },
  { icon: Drama, category: "Leisure", target: 200, spent: 174 },
]
export default function Budget() {
  return (
    <div>
      <Navbar>
        <div className ="budget-content">
        <h2>Budget Goals</h2>
        <div className="budget-grid">
          {budgets.map((b) => (
            <BudgetCard key={b.category} {...b} />
          ))}
        </div>
        </div>
        <Footer />
      </Navbar>
    </div>
  )
}

