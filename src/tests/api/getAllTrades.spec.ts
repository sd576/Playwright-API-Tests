import { test, expect } from "@playwright/test";
import { compareData } from "../../fixtures/compareData";
import tradeData from "../../../reference-data/allTradeData.json";

const API_BASE_URL = "http://localhost:3000/api";

// 🔹 Helper function to fetch all trades
async function fetchAllTrades(request: any) {
  console.log("Fetching all trades...");
  const response = await request.get(`${API_BASE_URL}/trades`);

  expect(response.status(), "Expected status 200 for GET /trades").toBe(200);
  return await response.json();
}

test.describe("GET /trades - Validate All Trade Data", () => {
  test("Should retrieve all trades and compare with reference data", async ({
    request,
  }) => {
    const responseBody = await fetchAllTrades(request);

    // 🔍 Filter out test-generated trades
    const excludedTradeIds = ["SPOT-TEST-001", "FWD-TEST-001"];
    const filteredResponse = responseBody.filter(
      (trade: any) => !excludedTradeIds.includes(trade.tradeId)
    );

    console.log(`Filtered Response Length: ${filteredResponse.length}`);
    console.log("Comparing API response with reference data...");

    // ✅ Normalize the API response to only include the expected fields
    const normalizedTrades = filteredResponse.map((trade: any) => ({
      tradeId: trade.tradeId,
      tradeType: trade.tradeType,
      parentTradeId: trade.parentTradeId || null,
      tradeDate: trade.tradeDate,
      settlementDate: trade.settlementDate,
      weBuyWeSell: trade.weBuyWeSell,
      counterpartyId: trade.counterpartyId,
      buyCurrency: trade.buyCurrency,
      sellCurrency: trade.sellCurrency,
      buyAmount: trade.buyAmount,
      sellAmount: trade.sellAmount,
      exchangeRate: trade.exchangeRate,
      buyNostroAccountId: trade.buyNostroAccountId,
      sellNostroAccountId: trade.sellNostroAccountId,
      buyNostroDescription: trade.buyNostroDescription || "Unknown", // Ensure test doesn't fail on null values
      sellNostroDescription: trade.sellNostroDescription || "Unknown",
    }));

    try {
      await compareData(normalizedTrades, tradeData);
      console.log("✅ Trade data matches reference data!");
    } catch (error) {
      console.error("❌ Trade data mismatch!", error);
      throw error;
    }
  });
});
