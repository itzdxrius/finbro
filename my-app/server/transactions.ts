import axios from "axios";
import * as fs from "fs";
import "dotenv/config";

const TRANSACTIONS_URL = "https://sandbox.plaid.com/transactions/sync";
async function sync_transactions(access_token) {
        
    const transactions_post_data = {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_CLIENT_SECRET,
        access_token: access_token
    }
    const transactions = await axios.post(TRANSACTIONS_URL, transactions_post_data)
    return transactions.data;
}


async function sync_transactions_test(access_token) {
    const transactions = await sync_transactions(access_token)
    // replace below with a write to supabase
    fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2))
}

// const access_token = *get from supabase
const access_token = process.env.PLAID_ACCESS_TOKEN;
sync_transactions_test(access_token)



