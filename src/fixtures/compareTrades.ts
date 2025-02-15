import { expect } from "@playwright/test";

// Function to normalize dynamic fields (tradeDate, settlementDate) to 'DYNAMIC'
const normalizeTradeDates = (trade: any) => ({
  ...trade,
  tradeDate: "DYNAMIC",
  settlementDate: "DYNAMIC",
});

// Function to normalize other fields for consistent comparison
const normalize = (trade: any) => ({
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
});

// Main compareTrades function
export async function compareTrades(apiResponse: any[], referenceData: any[]) {
  console.log(
    "Normalizing and sorting trade data for consistent comparison..."
  );

  // Normalize and sort the API response
  const normalizedResponse = apiResponse
    .map(normalize)
    .map(normalizeTradeDates)
    .sort((a: any, b: any) => a.tradeId.localeCompare(b.tradeId));

  // Normalize and sort the reference data
  const normalizedReference = referenceData
    .map(normalize)
    .map(normalizeTradeDates)
    .sort((a: any, b: any) => a.tradeId.localeCompare(b.tradeId));

  // Log the count of trades in each array for debugging
  console.log(`API Response Count: ${normalizedResponse.length}`);
  console.log(`Reference Data Count: ${normalizedReference.length}`);

  console.log(
    "🔍 Normalized API Response:",
    JSON.stringify(normalizedResponse, null, 2)
  );
  console.log(
    "🔍 Normalized Reference Data:",
    JSON.stringify(normalizedReference, null, 2)
  );

  // Compare the normalized and sorted responses
  try {
    expect(normalizedResponse).toEqual(normalizedReference);
    console.log("✅ Trade data matches reference data!");
  } catch (error) {
    console.error("❌ Trade data does NOT match reference data.");
    throw error;
  }
}
