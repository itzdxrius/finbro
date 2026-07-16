import axios from "axios";
import * as fs from "fs";
import "dotenv/config";

const TRANSACTIONS_URL = "https://sandbox.plaid.com/transactions/sync";
async function sync_transactions() {
    const access_token = process.env.PLAID_ACCESS_TOKEN;    
    const transactions_post_data = {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_CLIENT_SECRET,
        access_token: access_token
    }
    const transactions = await axios.post(TRANSACTIONS_URL, transactions_post_data)
    fs.writeFileSync("transactions.json", JSON.stringify(transactions.data, null, 2))
}

sync_transactions()
