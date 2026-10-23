import { describe, it, expect } from "vitest";
import { tryPurchase } from "@/lib/kozir";

describe("skin purchase", () => {
  it("deducts price when affordable", () => expect(tryPurchase(1250, 400)).toBe(850));
  it("refuses when not enough coins", () => expect(tryPurchase(300, 400)).toBeNull());
});
