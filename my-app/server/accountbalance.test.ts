import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { get_account_balance } from "./accountbalance";

vi.mock("axios");

describe("get_account_balance", () => {
    beforeEach(() => {
        vi.mocked(axios.post).mockReset();
    });

    it("returns the current balance of the first account", async () => {
        vi.mocked(axios.post).mockResolvedValueOnce({
            data: { accounts: [{ balances: { current: 1234.56 } }] },
        });

        const balance = await get_account_balance("token");

        expect(balance).toBe(1234.56);
    });

    it("sends the access token to Plaid's balance endpoint", async () => {
        vi.mocked(axios.post).mockResolvedValueOnce({
            data: { accounts: [{ balances: { current: 0 } }] },
        });

        await get_account_balance("abc-token");

        expect(axios.post).toHaveBeenCalledWith(
            "https://sandbox.plaid.com/accounts/balance/get",
            expect.objectContaining({ access_token: "abc-token" })
        );
    });
});
