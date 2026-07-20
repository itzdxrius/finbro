import { describe, it, expect } from "vitest";
import { initialize_plaid_account } from "./plaidapi";
import { sync_transactions } from "./transactions";
import { get_account_balance } from "./accountbalance";
import { supabase } from "./supabase";

describe("Plaid sandbox integration", () => {
    it("links a sandbox item and syncs transactions end-to-end", async () => {
        const accessToken = await initialize_plaid_account("user_good", "pass_good");
        expect(typeof accessToken).toBe("string");

        const synced = await sync_transactions(accessToken, null);
        expect(synced.accounts.length).toBeGreaterThan(0);
        expect(Array.isArray(synced.added)).toBe(true);

        const balance = await get_account_balance(accessToken);
        expect(typeof balance).toBe("number");
    });
});

describe("Supabase connectivity", () => {
    it("can query the accounts table with the service role client", async () => {
        const { error } = await supabase.from("accounts").select("id").limit(1);

        expect(error).toBeNull();
    });
});
