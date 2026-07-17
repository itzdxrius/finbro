import axios from "axios";
import "dotenv/config";

const TRANSACTIONS_URL = "https://sandbox.plaid.com/transactions/sync";
export async function sync_transactions(access_token) {
        
    const transactions_post_data = {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_CLIENT_SECRET,
        access_token: access_token
    }
    const transactions = await axios.post(TRANSACTIONS_URL, transactions_post_data)
    return transactions.data;
}


