import {initialize_plaid_account} from "./plaidapi"
import {sync_transactions} from "./transactions"
import {get_account_balance} from "./accountbalance"
import * as fs from "fs";


async function test(user, pass) {
    const token = await initialize_plaid_account(user, pass);
    const transactions = await sync_transactions(token, "") 
    const balance = await get_account_balance(token)
    console.log(balance)
    fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2))
}

let user = "user_good";
let pass = "pass_good";
test(user, pass) 
