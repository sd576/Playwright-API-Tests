import { expect } from "@playwright/test";

export function compareTrades(responseBody: any, referenceData: any): void {
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

  // Normalize and sort by tradeId for consistent comparison
  const normalizedResponse = responseBody
    .map(normalize)
    .sort((a: any, b: any) => a.tradeId.localeCompare(b.tradeId));
  const normalizedReference = referenceData
    .map(normalize)
    .sort((a: any, b: any) => a.tradeId.localeCompare(b.tradeId));

  console.log(
    "🔍 Normalized API Response:",
    JSON.stringify(normalizedResponse, null, 2)
  );
  console.log(
    "🔍 Normalized Reference Data:",
    JSON.stringify(normalizedReference, null, 2)
  );

  // Compare the normalized and sorted responses
  expect(normalizedResponse).toEqual(normalizedReference);
}
