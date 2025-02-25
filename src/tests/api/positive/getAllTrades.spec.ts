import { test, expect } from "@playwright/test";
import { compareData } from "../../../fixtures/compareData";
import tradeData from "../../../../reference-data/allTradeData.json";

const API_ENDPOINT = "http://localhost:3000/api/trades";

test.describe("GET /trades - Validate All Trade Data", () => {
  test("Should retrieve all trades and compare with reference data", async ({
    request,
  }) => {
    console.log("🔍 Fetching trades from API...");
    const response = await request.get(API_ENDPOINT);
    expect(response.status()).toBe(200);

    let responseBody = await response.json();

    const excludedTradeIds = ["SPOT-TEST-001", "FWD-TEST-001", "SWAP-TEST-001"];
    responseBody = responseBody.filter(
      (trade: any) => !excludedTradeIds.includes(trade.tradeId)
    );

    console.log(
      `API returned ${responseBody.length} trades, comparing with reference data...`
    );

    try {
      compareData(responseBody, tradeData);
      console.log("✅ Trade data matches reference data!");
    } catch (error) {
      console.error("Trade data mismatch detected!");
      throw error;
    }
  });
});
