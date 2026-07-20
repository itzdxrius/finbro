import axios from "axios";
import * as dotenv from "dotenv";
import {supabase} from "./supabase";

dotenv.config();

const ACCOUNT_BALANCE_URL = 'https://sandbox.plaid.com/accounts/balance/get'

export async function get_account_balance(userId: string) {

    const{data:account, error} = await supabase 
        .from("accounts").select("access_token").eq("user_id", userId).single();

    if(error) throw error;

    const balance_post_data = {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_CLIENT_SECRET,
        access_token: account.access_token,
    }
    const balance_response = await axios.post(ACCOUNT_BALANCE_URL, balance_post_data)
    const balance = balance_response.data.accounts[0].balances.current;

    const{error:updateError} = await supabase 
        .from("accounts").update({current_balance: balance}).eq("user_id", userId);

    if(updateError) throw updateError;

    return balance;
}