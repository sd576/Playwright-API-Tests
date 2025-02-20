import { expect } from "@playwright/test";

export function compareData(responseBody: any[], referenceData: any[]): void {
  const normalize = (entry: any) => ({
    tradeId: entry.tradeId,
    tradeType: entry.tradeType,
    parentTradeId: entry.parentTradeId || null,
    // ❌ Ignoring tradeDate & settlementDate in assertion
    weBuyWeSell: entry.weBuyWeSell,
    counterpartyId: entry.counterpartyId,
    buyCurrency: entry.buyCurrency,
    sellCurrency: entry.sellCurrency,
    buyAmount: entry.buyAmount,
    sellAmount: entry.sellAmount,
    exchangeRate: entry.exchangeRate,
    buyNostroAccountId: entry.buyNostroAccountId || "Unknown",
    sellNostroAccountId: entry.sellNostroAccountId || "Unknown",
    buyNostroDescription: entry.buyNostroDescription || "Unknown",
    sellNostroDescription: entry.sellNostroDescription || "Unknown",
  });

  const normalizedResponse = responseBody.map(normalize);
  const normalizedReference = referenceData.map(normalize);

  console.log(
    "🔍 Normalized API Response:",
    JSON.stringify(normalizedResponse, null, 2)
  );
  console.log(
    "🔍 Normalized Reference Data:",
    JSON.stringify(normalizedReference, null, 2)
  );

  try {
    expect(normalizedResponse).toEqual(normalizedReference);
    console.log("✅ All trades match expected reference data!");
  } catch (error) {
    console.error("❌ Data mismatch detected!");
    console.error(error);
    throw error; // Ensure test fails properly
  }
}
