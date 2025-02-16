import { test, expect } from "@playwright/test";
import {
  waitForServerReady,
  ensureResourceClean,
} from "../../fixtures/serverSetup";

const API_BASE_URL = "http://localhost:3000/api";
const SPOT_TRADE_ID = "SPOT-TEST-001";

const newSpotTrade = {
  tradeId: SPOT_TRADE_ID,
  tradeType: "SPOT",
  parentTradeId: null,
  tradeDate: "2025-02-27",
  settlementDate: "2025-02-28",
  weBuyWeSell: "we buy",
  counterpartyId: "001",
  buyCurrency: "EUR",
  sellCurrency: "USD",
  buyAmount: 1000000,
  sellAmount: 1100000,
  exchangeRate: 1.1,
  buyNostroAccountId: "001-EUR",
  sellNostroAccountId: "001-USD",
};

// Helper function to normalize dates to YYYY-MM-DD format
const normalizeDates = (trade: any) => ({
  ...trade,
  tradeDate: trade.tradeDate ? trade.tradeDate.substring(0, 10) : "",
  settlementDate: trade.settlementDate
    ? trade.settlementDate.substring(0, 10)
    : "",
});

test.beforeEach(async ({ request }) => {
  if (process.env.CI) {
    console.log("🔄 Running server readiness check in pipeline...");
    await waitForServerReady(request, `${API_BASE_URL}/trades`);
  }

  await ensureResourceClean(
    request,
    `${API_BASE_URL}/trades`,
    SPOT_TRADE_ID,
    newSpotTrade
  );
});

test.describe("Spot Trade CRUD Operations", () => {
  test("POST - Create new Spot Trade", async ({ request }) => {
    console.log(`✅ Creating ${SPOT_TRADE_ID}...`);
    const postResponse = await request.post(`${API_BASE_URL}/trades`, {
      data: newSpotTrade,
    });
    expect(postResponse.status()).toBe(201);

    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);
    console.log("GET Response after POST:", await getResponse.json());
  });

  test("GET - Retrieve Spot Trade", async ({ request }) => {
    console.log("🔍 Fetching Spot Trade...");
    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);

    const responseBody = normalizeDates(await getResponse.json());
    console.log(responseBody);
    expect(responseBody).toMatchObject(newSpotTrade);
  });

  test("PUT - Fully update Spot Trade", async ({ request }) => {
    console.log("🚀 Performing full update via PUT...");
    const updatedData = {
      ...newSpotTrade,
      buyAmount: 2000000,
      sellAmount: 2200000,
      exchangeRate: 1.2,
    };

    const putResponse = await request.put(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`,
      {
        data: updatedData,
      }
    );
    expect(putResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    const responseBody = normalizeDates(await getUpdatedResponse.json());
    expect(responseBody).toMatchObject(updatedData);
  });

  test("PATCH - Partially update Spot Trade", async ({ request }) => {
    console.log("🚀 Performing partial update via PATCH...");
    const patchData = { weBuyWeSell: "we sell" };

    const patchResponse = await request.patch(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`,
      {
        data: patchData,
      }
    );
    expect(patchResponse.status()).toBe(200);

    const getPatchedResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    const patchedTrade = normalizeDates(await getPatchedResponse.json());
    expect(patchedTrade.weBuyWeSell).toBe("we sell");
  });

  test("DELETE - Remove Spot Trade", async ({ request }) => {
    console.log("🚀 Deleting Spot Trade...");
    const deleteResponse = await request.delete(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(deleteResponse.status()).toBe(204);

    const getDeletedResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(getDeletedResponse.status()).toBe(404);
  });
});
