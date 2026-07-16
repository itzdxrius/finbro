import { supabase } from "./supabase";


export interface PlaidTransaction {
  transaction_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name: string | null;
}

// Our transactions table links to our own accounts.id, not Plaid's account id,
// so every save needs to look up the row for the user's (single) linked account first.
async function getAccountId(userId: string): Promise<string> {
  const { data: account, error } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return account.id;
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

// Saves a manually-entered expense (no Plaid transaction behind it, category typed by the user).
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
