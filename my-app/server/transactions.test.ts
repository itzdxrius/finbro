import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { sync_transactions } from "./transactions";

vi.mock("axios");

describe("sync_transactions", () => {
    beforeEach(() => {
        vi.mocked(axios.post).mockReset();
    });

    it("returns immediately when Plaid reports the sync as ready", async () => {
        vi.mocked(axios.post).mockResolvedValueOnce({
            data: { transactions_update_status: "HISTORICAL_UPDATE_COMPLETE", added: [] },
        });

        const result = await sync_transactions("token", null);

        expect(result.transactions_update_status).toBe("HISTORICAL_UPDATE_COMPLETE");
        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it("polls again while Plaid reports NOT_READY, then returns once ready", async () => {
        vi.useFakeTimers();
        vi.mocked(axios.post)
            .mockResolvedValueOnce({ data: { transactions_update_status: "NOT_READY" } })
            .mockResolvedValueOnce({ data: { transactions_update_status: "NOT_READY" } })
            .mockResolvedValueOnce({ data: { transactions_update_status: "HISTORICAL_UPDATE_COMPLETE" } });

        const promise = sync_transactions("token", null);
        await vi.advanceTimersByTimeAsync(5000);
        await vi.advanceTimersByTimeAsync(5000);
        const result = await promise;

        expect(result.transactions_update_status).toBe("HISTORICAL_UPDATE_COMPLETE");
        expect(axios.post).toHaveBeenCalledTimes(3);
        vi.useRealTimers();
    });

    it("throws once Plaid stays NOT_READY past the 60s timeout", async () => {
        vi.useFakeTimers();
        vi.mocked(axios.post).mockResolvedValue({ data: { transactions_update_status: "NOT_READY" } });

        const promise = sync_transactions("token", null);
        promise.catch(() => {});
        await vi.advanceTimersByTimeAsync(65000);

        await expect(promise).rejects.toThrow("Transactions failed to become ready");
        vi.useRealTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });
});
