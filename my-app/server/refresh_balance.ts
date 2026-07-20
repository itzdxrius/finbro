import { get_account_balance } from "./accountbalance";

const userId = process.argv[2];

if (!userId) {
    console.error("Usage: npx tsx server/refresh_balance.ts <supabase_user_id>");
    process.exit(1);
}

get_account_balance(userId)
    .then((balance) => console.log(`Updated balance for user ${userId}: ${balance}`))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });