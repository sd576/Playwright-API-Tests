import { test, expect } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api/trades";

// Expected error messages for SWAP trades
const swapValidationErrors = {
  tradeId: "Trade ID must be a non-empty string",
  tradeType: "Trade type must be one of 'SPOT', 'FORWARD', or 'SWAP'",
  tradeDate: "Trade date must be in YYYY-MM-DD format",
  settlementDate: "Settlement date must be in YYYY-MM-DD format",
  weBuyWeSell: "We Buy/We Sell must be either 'we buy' or 'we sell'",
  counterpartyId: "Counterparty ID is required",
  buyCurrency: "Buy currency must be a valid 3-letter currency code",
  sellCurrency: "Sell currency must be a valid 3-letter currency code",
  // Removed "differentCurrencies" because it should not trigger when both are missing
  buyAmount: "Buy amount must be a positive number",
  sellAmount: "Sell amount must be a positive number",
  exchangeRate: "Exchange rate must be a positive number",
  swapParentId: "SWAP trades must have a parentTradeId",
};

test.describe("❌ SWAP Trade Validation Errors", () => {
  test("❌ Should fail when required fields are missing for SWAP trade", async ({
    request,
  }) => {
    const invalidSwapTrade = {}; // Empty payload triggers required-field validations

    const response = await request.post(API_BASE_URL, {
      data: invalidSwapTrade,
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();

    console.log("🔍 SWAP Validation Response:", responseBody);

    // Extract only the error messages
    const errorMessages = responseBody.errors.map((e: any) => e.msg);

    expect(errorMessages).toEqual(
      expect.arrayContaining([
        swapValidationErrors.tradeId,
        swapValidationErrors.tradeType,
        swapValidationErrors.tradeDate,
        swapValidationErrors.settlementDate,
        swapValidationErrors.weBuyWeSell,
        swapValidationErrors.counterpartyId,
        swapValidationErrors.buyCurrency,
        swapValidationErrors.sellCurrency,
        swapValidationErrors.buyAmount,
        swapValidationErrors.sellAmount,
        swapValidationErrors.exchangeRate,
        swapValidationErrors.swapParentId,
      ])
    );
  });

  test("❌ Should fail when invalid data types are sent for SWAP trade", async ({
    request,
  }) => {
    const invalidSwapTrade = {
      tradeId: 12345, // Fails isString() → "Trade ID must be a non-empty string"
      tradeType: "SWAP", // Valid type so no error here
      tradeDate: "32-13-2025", // Fails regex → "Trade date must be in YYYY-MM-DD format"
      settlementDate: "invalid-date", // Fails regex → "Settlement date must be in YYYY-MM-DD format"
      weBuyWeSell: "invalid", // Fails isIn() → "We Buy/We Sell must be either 'we buy' or 'we sell'"
      counterpartyId: null, // Fails isString() → "Counterparty ID is required"
      buyCurrency: "US", // Fails length → "Buy currency must be a valid 3-letter currency code"
      sellCurrency: "EU", // Fails length → "Sell currency must be a valid 3-letter currency code"
      buyAmount: "ten", // Fails isFloat() → "Buy amount must be a positive number"
      sellAmount: -100, // Fails isFloat({ gt: 0 }) → "Sell amount must be a positive number"
      exchangeRate: "invalid", // Fails isFloat({ gt: 0 }) → "Exchange rate must be a positive number"
      parentTradeId: 123, // Fails isString() → "SWAP trades must have a parentTradeId"
    };

    const response = await request.post(API_BASE_URL, {
      data: invalidSwapTrade,
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();

    console.log("🔍 Invalid SWAP Data Response:", responseBody);

    // Extract only the error messages
    const errorMessages = responseBody.errors.map((e: any) => e.msg);

    // Because tradeType is valid ("SWAP") here, we don't expect an error for tradeType
    expect(errorMessages).toEqual(
      expect.arrayContaining([
        swapValidationErrors.tradeId,
        swapValidationErrors.tradeDate,
        swapValidationErrors.settlementDate,
        swapValidationErrors.weBuyWeSell,
        swapValidationErrors.counterpartyId,
        swapValidationErrors.buyCurrency,
        swapValidationErrors.sellCurrency,
        swapValidationErrors.buyAmount,
        swapValidationErrors.sellAmount,
        swapValidationErrors.exchangeRate,
        swapValidationErrors.swapParentId,
      ])
    );
  });

  test("❌ Should return 404 when retrieving a non-existent SWAP trade", async ({
    request,
  }) => {
    const response = await request.get(`${API_BASE_URL}/INVALID-SWAP-TRADE-ID`);
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    // Adjusted to match the controller response field 'error'
    expect(responseBody.error).toBe("Trade not found");
  });
});
