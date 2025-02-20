import { expect } from "@playwright/test";

export function compareData(responseBody: any[], referenceData: any[]): void {
  const normalize = (entry: any) => ({
    tradeId: entry.tradeId,
    tradeType: entry.tradeType,
    parentTradeId: entry.parentTradeId || null,
    // ❌ Ignoring tradeDate & settlementDate
    weBuyWeSell: entry.weBuyWeSell,
    counterpartyId: entry.counterpartyId,
    buyCurrency: entry.buyCurrency,
    sellCurrency: entry.sellCurrency,
    buyAmount: entry.buyAmount,
    sellAmount: entry.sellAmount,
    exchangeRate: entry.exchangeRate,
    buyNostroAccountId: entry.buyNostroAccountId || "",
    sellNostroAccountId: entry.sellNostroAccountId || "",
    buyNostroDescription: entry.buyNostroDescription || "",
    sellNostroDescription: entry.sellNostroDescription || "",
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

    // 🔍 Better Debugging: Print mismatched trades
    normalizedResponse.forEach((trade, index) => {
      const expected = normalizedReference[index];
      if (JSON.stringify(trade) !== JSON.stringify(expected)) {
        console.error(`🛑 Mismatch at index ${index}:`);
        console.error("🔴 Received:", trade);
        console.error("🟢 Expected:", expected);
      }
    });

    throw error;
  }
}
