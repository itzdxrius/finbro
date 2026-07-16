import { supabase } from "./supabase";

export async function saveBudgetGoal(userId: string, category: string, monthlyLimit: number) {
  const { error } = await supabase
    .from("budgets")
    .insert({ user_id: userId, category, monthly_limit: monthlyLimit });

  if (error) throw error;
}
