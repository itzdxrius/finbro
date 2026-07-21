import { describe, it, expect } from "vitest";
import { gemini } from "./geminiapi";

describe("Gemini AI financial coach", () => {
    it("returns a non-empty string response for a simple transaction", async () => {
        const response = await gemini("Starbucks: $100");

        expect(typeof response).toBe("string");
        expect(response.length).toBeGreaterThan(0);
    });

    it("returns a response for multiple transactions", async () => {
        const history = "Starbucks: $100, Whole Foods: $45.20, Netflix: $15.99";
        const response = await gemini(history);

        expect(typeof response).toBe("string");
        expect(response.length).toBeGreaterThan(0);
    });

    it("resolves without throwing when given minimal input", async () => {
        await expect(gemini("No transactions available")).resolves.toBeTypeOf("string");
    });
});
