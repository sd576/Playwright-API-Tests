import { test, expect } from "@playwright/test";
import {
  waitForServerReady,
  ensureResourceClean,
} from "../../../fixtures/serverSetup";

const API_BASE_URL = "http://localhost:3000/api";
const SWAP_TRADE_ID = "SWAP-TEST-001";
const SWAP_TRADE_FAR_ID = `${SWAP_TRADE_ID}-FAR`;

const newSwapTrade = {
  tradeId: SWAP_TRADE_ID,
  tradeType: "SWAP",
  parentTradeId: SWAP_TRADE_ID,
  tradeDate: "2025-02-27",
  settlementDate: "2025-03-30",
  weBuyWeSell: "we sell",
  counterpartyId: "003",
  buyCurrency: "EUR",
  sellCurrency: "USD",
  buyAmount: 1500000,
  sellAmount: 1650000,
  exchangeRate: 1.1,
  buyNostroAccountId: "003-EUR",
  sellNostroAccountId: "003-USD",
};

test.describe("🌀 Swap Trade Full CRUD Operations", () => {
  test.beforeEach(async ({ request }, testInfo) => {
    console.log(`🔄 Running setup for test: ${testInfo.title}`);

    if (process.env.CI) {
      console.log("🔄 Running server readiness check in pipeline...");
      await waitForServerReady(request, `${API_BASE_URL}/trades`);
    }

    await ensureResourceClean(
      request,
      `${API_BASE_URL}/trades`,
      SWAP_TRADE_ID,
      newSwapTrade
    );

    console.log("⏳ Waiting before running GET...");
    await new Promise((r) => setTimeout(r, 1000));
  });

  // POST - Create Swap Trade
  test("✅ POST - Create Swap Trade", async ({ request }) => {
    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);

    const nearLegBody = await getResponse.json();
    expect(nearLegBody).toMatchObject(newSwapTrade);
  });

  // GET - Retrieve Swap Trade and Far Leg
  test("🔍 GET - Retrieve Swap Trade and Far Leg", async ({ request }) => {
    console.log("🔍 Fetching Near Leg Trade...");
    const nearLegResponse = await request.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    const nearLegBody = await nearLegResponse.json();

    // Normalize fields before comparison
    nearLegBody.weBuyWeSell = nearLegBody.weBuyWeSell.toLowerCase();

    console.log("🔍 API Swap Trades:", nearLegBody);
    expect(nearLegResponse.status()).toBe(200);
    expect(nearLegBody).toMatchObject(newSwapTrade);

    console.log("🔍 Fetching Far Leg Trade...");
    const farLegResponse = await request.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_FAR_ID}`
    );
    const farLegBody = await farLegResponse.json();
    console.log("🔍 Far Leg Trade Data:", farLegBody);
    expect(farLegResponse.status()).toBe(200);
  });

  // PUT - Fully Update Swap Trade
  test("✏️ PUT - Fully Update Swap Trade", async ({ request }) => {
    console.log("🚀 Performing full update via PUT...");

    const updatedData = {
      ...newSwapTrade,
      tradeDate: "2025-03-01",
      settlementDate: "2025-04-05",
      weBuyWeSell: "we buy",
      counterpartyId: "004",
      buyCurrency: "USD",
      sellCurrency: "JPY",
      buyAmount: 1200000,
      sellAmount: 140004000,
      exchangeRate: 116.67,
      buyNostroAccountId: "004-USD",
      sellNostroAccountId: "004-JPY",
    };

    console.log("📝 PUT Request Data:", updatedData);

    const putResponse = await request.put(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`,
      {
        headers: { "Content-Type": "application/json" },
        data: updatedData,
      }
    );

    console.log("🔍 PUT Response Status:", putResponse.status());
    expect(putResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    const updatedTrade = await getUpdatedResponse.json();

    expect(updatedTrade).toMatchObject(updatedData);
  });

  // PATCH - Partial Update (Change exchangeRate)
  test("🔄 PATCH - Partially Update Swap Trade", async ({ request }) => {
    const patchData = { exchangeRate: 1.12 };
    const patchResponse = await request.patch(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`,
      {
        data: patchData,
      }
    );

    expect(patchResponse.status()).toBe(200);

    const updatedTrade = await request
      .get(`${API_BASE_URL}/trades/${SWAP_TRADE_ID}`)
      .then((res) => res.json());

    // Ensure exchange rate matches with proper precision
    expect(updatedTrade.exchangeRate.toFixed(4)).toBe(
      patchData.exchangeRate.toFixed(4)
    );
  });

  // DELETE - Remove Swap Trade
  test("🗑️ DELETE - Remove Swap Trade", async ({ request }) => {
    const deleteResponse = await request.delete(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    expect(deleteResponse.status()).toBe(204);

    const getDeletedResponse = await request.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    expect(getDeletedResponse.status()).toBe(404);
  });
});
