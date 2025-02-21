import { test, expect } from "@playwright/test";
import { request } from "http";

const API_BASE_URL = "http://localhost:3000/api/trades";

// 🔥 Validation error messages from tradeValidator.js
const validationErrors = {
  tradeId: "Trade ID must be a non-empty string",
  tradeType: "Trade type must be one of 'SPOT', 'FORWARD', or 'SWAP'",
  tradeDate: "Trade date must be in YYYY-MM-DD format",
  settlementDate: "Settlement date must be in YYYY-MM-DD format",
  tradeDateBeforeSettlement: "Trade date must be before settlement date",
  weBuyWeSell: "We Buy/We Sell must be either 'we buy' or 'we sell'",
  counterpartyId: "Counterparty ID is required",
  sellCurrency: "Sell currency must be a valid 3-letter currency code",
  buyCurrency: "Buy currency and Sell currency must be different",
  buyAmount: "Buy amount must be a positive number",
  sellAmount: "Sell amount must be a positive number",
  exchangeRate: "Exchange rate must be a positive number",
  swapParentId: "SWAP trades must have a parentTradeId",
};

// ✅ Loop through SPOT, FORWARD, SWAP trades
const tradeTypes = ["SPOT", "FORWARD", "SWAP"];

test.describe("❌ Trade Validation Errors", () => {
  for (const tradeType of tradeTypes) {
    test(`❌ Should fail when required fields are missing for ${tradeType}`, async ({
      request,
    }) => {
      const invalidTradePayload = {};

      const response = await request.post(API_BASE_URL, {
        data: invalidTradePayload,
      });

      expect(response.status()).toBe(400);
      const responseBody = await response.json();

      console.log(`🔍 Response for ${API_BASE_URL}:`, responseBody);

      // 🔹 Check that ALL expected validation errors exist in response
      expect(responseBody.errors).toEqual(
        expect.arrayContaining([
          { msg: validationErrors.tradeId },
          { msg: validationErrors.tradeDate },
          { msg: validationErrors.settlementDate },
          { msg: validationErrors.tradeDateBeforeSettlement },
          { msg: validationErrors.weBuyWeSell },
          { msg: validationErrors.counterpartyId },
          { msg: validationErrors.sellCurrency },
          { msg: validationErrors.buyCurrency },
          { msg: validationErrors.buyAmount },
          { msg: validationErrors.sellAmount },
          { msg: validationErrors.exchangeRate },
          { msg: validationErrors.swapParentId },
        ])
      );

      // 🔷 Additional check for SWAP trades (parentTradeId required)
      if (tradeType === "SWAP") {
        expect(responseBody.errors).toEqual(
          expect.arrayContaining([{ msg: validationErrors.swapParentId }])
        );
      }
    });

    test(`❌ Should fail when invalid data types are sent for ${tradeType}`, async ({
      request,
    }) => {
      const invalidTradePAyload = {
        tradeId: 12345, // 🔴 Should be a string
        tradeType: "INVALID", // 🔴 Should be SPOT, FORWARD, SWAP
        tradeDate: "34-23-2025", // 🔴 Invalid date format
        settlementDate: "2025-14-20", // 🔴 Invalid date format
        tradeDateBeforeSettlement: "Trade date must be before settlement date",
        weBuyWeSell: "We Buy/We Sell must be either 'we buy' or 'we sell'",
        counterpartyId: "Counterparty ID is required",
        sellCurrency: "Sell currency must be a valid 3-letter currency code",
        buyCurrency: "Buy currency and Sell currency must be different",
        buyAmount: "Buy amount must be a positive number",
        sellAmount: "Sell amount must be a positive number",
        exchangeRate: "Exchange rate must be a positive number",
        swapParentId: "SWAP trades must have a parentTradeId",
      };
    });
  }
});
