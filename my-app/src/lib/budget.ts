import { supabase } from "./supabase";

export interface Budget {
  id: string;
  category: string;
  monthly_limit: number;
}

export async function saveBudgetGoal(userId: string, category: string, monthlyLimit: number) {
  const { error } = await supabase
    .from("budgets")
    .insert({ user_id: userId, category, monthly_limit: monthlyLimit });

  if (error) throw error;
}

export async function getBudgets(userId: string): Promise<Budget[]> {
  const { data, error } = await supabase
    .from("budgets")
    .select("id, category, monthly_limit")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}
