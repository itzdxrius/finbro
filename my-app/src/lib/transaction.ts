import { supabase } from "./supabase";


export interface PlaidTransaction {
  transaction_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name: string | null;
}

// transactions table links to our own accounts.id, not Plaid's account id
async function getAccountId(userId: string): Promise<string> {
  const { data: account, error } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return account.id;
}

export async function getAccountBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("accounts")
    .select("current_balance")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data.current_balance;
}

// Takes the transactions Plaid returns for a user and saves them to our transactions table.
export async function saveTransactions(userId: string, plaidTransactions: PlaidTransaction[]) {
  const accountId = await getAccountId(userId);

  const rows = plaidTransactions.map((tx) => ({
    user_id: userId,
    account_id: accountId,
    plaid_transaction_id: tx.transaction_id,
    merchant_name: tx.merchant_name ?? tx.name,
    amount: tx.amount,
    date: tx.date,
  }));

  const { error } = await supabase.from("transactions").insert(rows);
  if (error) throw error;
}


export async function saveExpense(
  userId: string,
  merchantName: string,
  amount: number,
  date: string,
  category: string
) {
  const accountId = await getAccountId(userId);

  const { error } = await supabase.from("transactions").insert({
    user_id: userId,
    account_id: accountId,
    merchant_name: merchantName,
    amount,
    date,
    category,
  });

  if (error) throw error;
}

export interface Transaction {
  id: string;
  merchant_name: string;
  amount: number;
  date: string;
  category: string | null;
}

// all of a user's transactions, most recent first
export async function getTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("id, merchant_name, amount, date, category")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

// sums this month's transaction amounts by category
export async function getSpendingByCategory(userId: string): Promise<Record<string, number>> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("user_id", userId)
    .gte("date", monthStart)
    .lt("date", monthEnd);

  if (error) throw error;

  const totals: Record<string, number> = {};
  for (const tx of data) {
    if (!tx.category) continue;
    totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount;
  }
  return totals;
}
