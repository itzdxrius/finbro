import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const ACCOUNT_BALANCE_URL = 'https://sandbox.plaid.com/accounts/balance/get'

export async function get_account_balance(access_token: string) {
    const balance_post_data = {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_CLIENT_SECRET,
        access_token: access_token,
    }
    const balance = await axios.post(ACCOUNT_BALANCE_URL, balance_post_data)
    return balance.data.accounts[0].balances.current;
}