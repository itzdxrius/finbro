import {initialize_plaid_account} from "./plaidapi"
import {sync_transactions} from "./transactions"
import * as fs from "fs";


async function test(user, pass) {
    const token = await initialize_plaid_account(user, pass);
    const transactions = await sync_transactions(token, "") 
    fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2))
}

let user = "user_good";
let pass = "pass_good";
test(user, pass) 
