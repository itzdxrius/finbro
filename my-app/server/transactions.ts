import axios from "axios";
import "dotenv/config";

const TRANSACTIONS_URL = "https://sandbox.plaid.com/transactions/sync";
async function sync_transactions_plaid(token) {
        
    const transactions_post_data = {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_CLIENT_SECRET,
        access_token: token
    }
    const transactions = await axios.post(TRANSACTIONS_URL, transactions_post_data)
    return transactions.data;
}

export async function sync_transactions(access_token) {
    for (let attempt = 1; attempt <=3; attempt++) {
        const transactions = await sync_transactions_plaid(access_token)
        if (transactions.transactions_update_status !== "NOT_READY") {
            return transactions;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    throw new Error("Transactions Failed to become ready");
}


