import { test, expect } from "@playwright/test";

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
  buyCurrency: "Buy currency must be a valid 3-letter currency code",
  sellCurrency: "Sell currency must be a valid 3-letter currency code",
  differentCurrencies: "Buy currency and Sell currency must be different",
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
      const invalidTradePayload = {}; // 🔹 Send an empty request to trigger all validation errors

      const response = await request.post(API_BASE_URL, {
        data: invalidTradePayload,
      });

      expect(response.status()).toBe(400); // 🔴 Expect HTTP 400 Bad Request
      const responseBody = await response.json();

      console.log(`🔍 Response for ${tradeType}:`, responseBody);

      // 🔹 Check that ALL expected validation errors exist in response
      expect(responseBody.errors).toEqual(
        expect.arrayContaining([
          { msg: validationErrors.tradeId },
          { msg: validationErrors.tradeType },
          { msg: validationErrors.tradeDate },
          { msg: validationErrors.settlementDate },
          { msg: validationErrors.weBuyWeSell },
          { msg: validationErrors.counterpartyId },
          { msg: validationErrors.buyCurrency },
          { msg: validationErrors.sellCurrency },
          { msg: validationErrors.buyAmount },
          { msg: validationErrors.sellAmount },
          { msg: validationErrors.exchangeRate },
        ])
      );

      // 🔹 Additional check for SWAP trades (parentTradeId required)
      if (tradeType === "SWAP") {
        expect(responseBody.errors).toEqual(
          expect.arrayContaining([{ msg: validationErrors.swapParentId }])
        );
      }
    });

    test(`❌ Should fail when invalid data types are sent for ${tradeType}`, async ({
      request,
    }) => {
      const invalidTradePayload = {
        tradeId: 12345, // 🔴 Should be a string
        tradeType: "INVALID", // 🔴 Should be SPOT, FORWARD, SWAP
        tradeDate: "32-13-2025", // 🔴 Invalid date format
        settlementDate: "2025-02-30", // 🔴 Invalid date format
        weBuyWeSell: "invalid", // 🔴 Should be "we buy" or "we sell"
        counterpartyId: null, // 🔴 Should be a string
        buyCurrency: "US", // 🔴 Should be 3 letters
        sellCurrency: "USD", // 🔴 Should not be the same as buyCurrency
        buyAmount: "ten", // 🔴 Should be a number
        sellAmount: -100, // 🔴 Should be positive
        exchangeRate: "invalid", // 🔴 Should be a number
        parentTradeId: tradeType === "SWAP" ? 123 : undefined, // 🔴 Should be a string for SWAP
      };

      const response = await request.post(API_BASE_URL, {
        data: invalidTradePayload,
      });

      expect(response.status()).toBe(400);
      const responseBody = await response.json();

      console.log(`🔍 Invalid Data Response for ${tradeType}:`, responseBody);

      expect(responseBody.errors).toEqual(
        expect.arrayContaining([
          { msg: validationErrors.tradeId },
          { msg: validationErrors.tradeType },
          { msg: validationErrors.tradeDate },
          { msg: validationErrors.settlementDate },
          { msg: validationErrors.weBuyWeSell },
          { msg: validationErrors.counterpartyId },
          { msg: validationErrors.buyCurrency },
          { msg: validationErrors.sellCurrency },
          { msg: validationErrors.buyAmount },
          { msg: validationErrors.sellAmount },
          { msg: validationErrors.exchangeRate },
        ])
      );

      if (tradeType === "SWAP") {
        expect(responseBody.errors).toEqual(
          expect.arrayContaining([{ msg: validationErrors.swapParentId }])
        );
      }
    });

    test(`❌ Should return 404 when retrieving a non-existent ${tradeType} trade`, async ({
      request,
    }) => {
      const response = await request.get(`${API_BASE_URL}/INVALID-TRADE-ID`);

      expect(response.status()).toBe(404);
      const responseBody = await response.json();
      expect(responseBody.message).toBe("Trade not found");
    });
  }
});
