import axios from "axios";
import "dotenv/config";

const TRANSACTIONS_URL = "https://sandbox.plaid.com/transactions/sync";
async function sync_transactions_plaid(access_token, cursor) {
        
    const transactions_post_data = {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_CLIENT_SECRET,
        access_token: access_token,
        cursor: cursor
    }
    const transactions = await axios.post(TRANSACTIONS_URL, transactions_post_data)
    return transactions.data;
}

export async function sync_transactions(access_token, cursor) {
    const timeout = 60000
    const start = Date.now()
    let transactions = await sync_transactions_plaid(access_token, cursor)
    while (transactions.transactions_update_status == "NOT_READY") {
        if (Date.now() - start >= timeout) {
            throw new Error("Transactions failed to become ready")
        }
        transactions = await sync_transactions_plaid(access_token, cursor)
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    return transactions;
}

