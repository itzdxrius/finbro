import { initialize_plaid_account } from "./plaidapi";
import { sync_transactions, categorize_transactions } from "./transactions";
import { supabase } from "./supabase";

interface PlaidTransaction {
    transaction_id: string;
    amount: number;
    date: string;
    name: string;
    merchant_name: string | null;
}

async function linkAccount(userId: string, username: string, password: string) {
    const accessToken = await initialize_plaid_account(username, password);
    const synced = await sync_transactions(accessToken);

    const account = synced.accounts[0];
    if (!account) {
        throw new Error("Plaid returned no accounts for this item");
    }

    const { data: accountRow, error: accountError } = await supabase
        .from("accounts")
        .upsert(
            {
                user_id: userId,
                plaid_account_id: account.account_id,
                institution_name: account.name,
                account_type: account.type,
                current_balance: account.balances.current,
                access_token: accessToken,
            },
            { onConflict: "user_id" }
        )
        .select("id")
        .single();

    if (accountError) throw accountError;
    

    const names = synced.added.map((tx: PlaidTransaction) => tx.merchant_name ?? tx.name);
    const categories = await categorize_transactions(names);
    

    const rows = synced.added.map((tx: PlaidTransaction,i:number) => ({
        user_id: userId,
        account_id: accountRow.id,
        plaid_transaction_id: tx.transaction_id,
        merchant_name: tx.merchant_name ?? tx.name,
        amount: tx.amount,
        date: tx.date,
        category: categories[i].category
    }));

    if (rows.length > 0) {
        const { error: txError } = await supabase.from("transactions").insert(rows);
        if (txError) throw txError;
    }

    console.log(`Linked account and saved ${rows.length} transactions for user ${userId}`);
}

const userId = process.argv[2];
const username = process.argv[3] ?? "user_good";
const password = process.argv[4] ?? "pass_good";

if (!userId) {
    console.error("Usage: npx tsx server/link_account.ts <supabase_user_id> [plaid_username] [plaid_password]");
    process.exit(1);
}

linkAccount(userId, username, password).catch((err) => {
    console.error(err);
    process.exit(1);
});
