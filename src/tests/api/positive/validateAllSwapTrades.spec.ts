import { test, expect } from "@playwright/test";
import swapTrades from "../../../../reference-data/allTradeData.json";

const API_BASE_URL = "http://localhost:3000/api";

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

  console.log(`Retrieved ${swapTradesFromAPI.length} SWAP trades from API`);
  console.log("🔍 Comparing with `allTradeData.json`...");

  const expectedSwapTrades: Trade[] = (swapTrades as Trade[])
    .filter((trade) => trade.tradeType === "SWAP")
    .map((trade) => ({
      ...trade,
      weBuyWeSell: trade.weBuyWeSell.toLowerCase() as "we buy" | "we sell",
    }));

  swapTradesFromAPI.forEach((trade) => {
    delete (trade as any).tradeDate;
    delete (trade as any).settlementDate;
    delete (trade as any).buyNostroDescription;
    delete (trade as any).sellNostroDescription;

    trade.exchangeRate = Number(trade.exchangeRate.toFixed(4));
    if (trade.parentTradeId === "") trade.parentTradeId = null;
  });

  console.log("🔍 API Swap Trades (from DB):", swapTradesFromAPI.length);
  console.log(
    "🔍 Expected Swap Trades (from JSON):",
    expectedSwapTrades.length
  );

  expectedSwapTrades.forEach((trade) => {
    delete (trade as any).tradeDate;
    delete (trade as any).settlementDate;
    delete (trade as any).buyNostroDescription;
    delete (trade as any).sellNostroDescription;

    trade.exchangeRate = Number(trade.exchangeRate.toFixed(4));
    if (trade.parentTradeId === "") trade.parentTradeId = null;
  });

  console.log(
    "🔍 API Swap Trades (fetched from DB):",
    JSON.stringify(swapTradesFromAPI, null, 2)
  );
  console.log(
    "🔍 Expected Swap Trades (from JSON file):",
    JSON.stringify(expectedSwapTrades, null, 2)
  );

  expect(swapTradesFromAPI).toEqual(expect.arrayContaining(expectedSwapTrades));

  console.log("✅ All SWAP trades match expected seed data!");
});
