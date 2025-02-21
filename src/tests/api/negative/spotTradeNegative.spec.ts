import { test, expect } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api/trades";

test.describe("❌ Negative Tests - Spot Trades", () => {
  test("❌ Should fail to create a spot trade with missing required fields", async ({
    request,
  }) => {
    const invalidPayload = {
      tradeType: "SPOT", // Missing required fields
      buyCurrency: "USD",
      sellCurrency: "EUR",
      buyAmount: 1000,
    };

    const response = await request.post(API_BASE_URL, { data: invalidPayload });
    expect(response.status()).toBe(400);

    const responseBody = await response.json();

    console.log(
      "🔍 API Response for Missing Fields:",
      JSON.stringify(responseBody, null, 2)
    ); // ✅ Debugging

    // Extract error messages safely
    const errorMessages = responseBody.errors
      ? responseBody.errors.map((err: any) => err.msg)
      : [];

    expect(errorMessages).toContain("counterpartyId is required");
    expect(errorMessages).toContain("tradeId is required");
    expect(errorMessages).toContain("Trade date must be in YYYY-MM-DD format");
    expect(errorMessages).toContain("Exchange rate must be a positive number");
  });

  test("❌ Should fail to create a spot trade with invalid data types", async ({
    request,
  }) => {
    const invalidPayload = {
      tradeId: 123, // Should be a string
      tradeType: "SPOT",
      tradeDate: "not-a-date", // Invalid date format
      counterpartyId: "002",
      buyCurrency: "USD",
      sellCurrency: "EUR",
      buyAmount: "ten-thousand", // Should be a number
      sellAmount: 9000,
      exchangeRate: "1.1", // Should be a float
    };

    const response = await request.post(API_BASE_URL, { data: invalidPayload });
    expect(response.status()).toBe(400);

    const responseBody = await response.json();

    console.log(
      "🔍 API Response for Invalid Data Types:",
      JSON.stringify(responseBody, null, 2)
    ); // ✅ Debugging

    // Extract error messages safely
    const errorMessages = responseBody.errors
      ? responseBody.errors.map((err: any) => err.msg)
      : [];

    expect(errorMessages).toContain("tradeId must be a string");
    expect(errorMessages).toContain("buyAmount must be a number");
    expect(errorMessages).toContain("tradeDate must be in YYYY-MM-DD format");
  });
});
