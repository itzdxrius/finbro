import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.PLAID_CLIENT_ID;
const CLIENT_SECRET = process.env.PLAID_CLIENT_SECRET;
const Public_Token_URL = 'https://sandbox.plaid.com/sandbox/public_token/create';
const EXCHANGE_TOKEN_URL = "https://sandbox.plaid.com/item/public_token/exchange";
// pull from supabase database and call function with it.

export async function initialize_plaid_account(username, password) {
	const public_token_post_data = {
	'client_id': CLIENT_ID,
	'secret': CLIENT_SECRET,
	'institution_id': 'ins_109508', 
	'initial_products': ['transactions'],
	'options' : {
    'override_username' : username,
    'override_password' : password
  }
}
	const response = await axios.post(Public_Token_URL, public_token_post_data);
	const PUBLIC_TOKEN = response.data.public_token;
	const exchangeData = {
        client_id: CLIENT_ID,
        secret: CLIENT_SECRET,
        public_token: PUBLIC_TOKEN
	};
	const acces_token_Response = await axios.post(EXCHANGE_TOKEN_URL, exchangeData);
	return acces_token_Response.data.access_token;	
}

