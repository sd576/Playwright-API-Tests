import { expect } from "@playwright/test";

const normalizeTradeDates = (trade: any) => ({
  ...trade,
  tradeDate: "DYNAMIC",
  settlementDate: "DYNAMIC",
});

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

export async function compareTrades(apiResponse: any[], referenceData: any[]) {
  console.log(
    "Normalizing and sorting trade data for consistent comparison..."
  );

  const normalizedResponse = apiResponse
    .map(normalize)
    .map(normalizeTradeDates)
    .sort((a: any, b: any) => a.tradeId.localeCompare(b.tradeId));

  const normalizedReference = referenceData
    .map(normalize)
    .map(normalizeTradeDates)
    .sort((a: any, b: any) => a.tradeId.localeCompare(b.tradeId));

  console.log(`API Response Count: ${normalizedResponse.length}`);
  console.log(`Reference Data Count: ${normalizedReference.length}`);

  // Filter the API response to include only trades present in the reference data
  const filteredResponse = normalizedResponse.filter((trade: any) =>
    normalizedReference.some((ref: any) => ref.tradeId === trade.tradeId)
  );

  console.log(`Filtered API Response Count: ${filteredResponse.length}`);

  // Count trades by tradeType for deeper analysis
  const responseByTradeType = filteredResponse.reduce(
    (acc: any, trade: any) => {
      acc[trade.tradeType] = (acc[trade.tradeType] || 0) + 1;
      return acc;
    },
    {}
  );

  const referenceByTradeType = normalizedReference.reduce(
    (acc: any, trade: any) => {
      acc[trade.tradeType] = (acc[trade.tradeType] || 0) + 1;
      return acc;
    },
    {}
  );

  console.log(
    "Filtered API Response Count by Trade Type:",
    responseByTradeType
  );
  console.log("Reference Data Count by Trade Type:", referenceByTradeType);

  console.log(
    "🔍 Normalized API Response:",
    JSON.stringify(filteredResponse, null, 2)
  );
  console.log(
    "🔍 Normalized Reference Data:",
    JSON.stringify(normalizedReference, null, 2)
  );

  try {
    expect(filteredResponse).toEqual(normalizedReference);
    console.log("✅ Trade data matches reference data!");
  } catch (error) {
    console.error("❌ Trade data does NOT match reference data.");
    throw error;
  }
}
