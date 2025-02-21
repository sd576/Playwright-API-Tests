import { test, expect } from "@playwright/test";
import swapTrades from "../../../../reference-data/allTradeData.json";

const API_BASE_URL = "http://localhost:3000/api";

// ✅ Define the Trade type inside the test file (self-contained)
interface Trade {
  tradeId: string;
  tradeType: string;
  parentTradeId?: string | null;
  weBuyWeSell: "we buy" | "we sell";
  counterpartyId: string;
  buyCurrency: string;
  sellCurrency: string;
  buyAmount: number;
  sellAmount: number;
  exchangeRate: number;
  buyNostroAccountId: string;
  sellNostroAccountId: string;
  buyNostroDescription?: string;
  sellNostroDescription?: string;
}

test("🔍 Validate All Seeded SWAP Trades Match Database", async ({
  request,
}) => {
  console.log("🔍 Fetching all SWAP trades from API...");

  // ✅ Introduce 1s delay to ensure DB commit is completed
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const getResponse = await request.get(`${API_BASE_URL}/trades`);
  expect(getResponse.status()).toBe(200);

  const tradesFromAPI: Trade[] = await getResponse.json();
  const swapTradesFromAPI: Trade[] = tradesFromAPI
    .filter((trade) => trade.tradeType === "SWAP")
    .map((trade) => ({
      ...trade,
      weBuyWeSell: trade.weBuyWeSell.toLowerCase() as "we buy" | "we sell",
    }));

  console.log(`✅ Retrieved ${swapTradesFromAPI.length} SWAP trades from API`);
  console.log("🔍 Comparing with `allTradeData.json`...");

  // ✅ Ensure the JSON import is correctly typed as Trade[]
  const expectedSwapTrades: Trade[] = (swapTrades as Trade[])
    .filter((trade) => trade.tradeType === "SWAP")
    .map((trade) => ({
      ...trade,
      weBuyWeSell: trade.weBuyWeSell.toLowerCase() as "we buy" | "we sell",
    }));

  // ✅ Normalize API response to match JSON data structure
  swapTradesFromAPI.forEach((trade) => {
    delete (trade as any).tradeDate; // 🚀 Ignore dynamically generated trade date
    delete (trade as any).settlementDate; // 🚀 Ignore dynamically adjusted settlement date
    delete (trade as any).buyNostroDescription; // 🚀 Ignore nostro descriptions
    delete (trade as any).sellNostroDescription; // 🚀 Ignore nostro descriptions

    trade.exchangeRate = Number(trade.exchangeRate.toFixed(4)); // Fix precision issues
    if (trade.parentTradeId === "") trade.parentTradeId = null;
  });

  console.log("🔍 API Swap Trades (from DB):", swapTradesFromAPI.length);
  console.log(
    "🔍 Expected Swap Trades (from JSON):",
    expectedSwapTrades.length
  );

  // ✅ Normalize expected JSON data to match API response
  expectedSwapTrades.forEach((trade) => {
    delete (trade as any).tradeDate; // 🚀 Ignore dynamically generated trade date
    delete (trade as any).settlementDate; // 🚀 Ignore dynamically adjusted settlement date
    delete (trade as any).buyNostroDescription; // 🚀 Ignore nostro descriptions
    delete (trade as any).sellNostroDescription; // 🚀 Ignore nostro descriptions

    trade.exchangeRate = Number(trade.exchangeRate.toFixed(4));
    if (trade.parentTradeId === "") trade.parentTradeId = null;
  });

  // ✅ Debugging: Log out API & Expected Swap Trades for troubleshooting
  console.log(
    "🔍 API Swap Trades (fetched from DB):",
    JSON.stringify(swapTradesFromAPI, null, 2)
  );
  console.log(
    "🔍 Expected Swap Trades (from JSON file):",
    JSON.stringify(expectedSwapTrades, null, 2)
  );

  // ✅ Ensure all SWAP trades from the API match expected seed data
  expect(swapTradesFromAPI).toEqual(expect.arrayContaining(expectedSwapTrades));

  console.log("✅ All SWAP trades match expected seed data!");
});
