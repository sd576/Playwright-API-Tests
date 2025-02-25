import { test, expect } from "@playwright/test";
import {
  waitForServerReady,
  ensureResourceClean,
} from "../../../fixtures/serverSetup";

const API_BASE_URL = "http://localhost:3000/api";
const SPOT_TRADE_ID = "SPOT-TEST-001";

const newSpotTrade = {
  tradeId: SPOT_TRADE_ID,
  tradeType: "SPOT",
  tradeDate: "2025-02-10",
  settlementDate: "2025-02-12",
  weBuyWeSell: "we sell",
  counterpartyId: "CPTY002",
  buyCurrency: "USD",
  sellCurrency: "GBP",
  buyAmount: 500000,
  sellAmount: 375000,
  exchangeRate: 0.75,
  buyNostroAccountId: "002-USD",
  sellNostroAccountId: "003-GBP",
};

test.describe("Spot Trade API - Full CRUD Operations", () => {
  test.beforeEach(async ({ request }, testInfo) => {
    console.log(`🔄 Running setup for test: ${testInfo.title}`);

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

  // POST - Create Spot Trade
  test("POST - Create new Spot Trade", async ({ request }) => {
    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newSpotTrade);
  });

  // GET - Retrieve Spot Trade
  test("GET - Retrieve Spot Trade", async ({ request }) => {
    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newSpotTrade);
  });

  // PUT - Fully Update Spot Trade
  test("PUT - Fully update Spot Trade", async ({ request }) => {
    const updatedData = {
      ...newSpotTrade,
      buyAmount: 550000,
      sellAmount: 412500,
    };
    const putResponse = await request.put(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`,
      { data: updatedData }
    );
    expect(putResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(await getUpdatedResponse.json()).toMatchObject(updatedData);
  });

  // PATCH - Partial Update (Change exchangeRate)
  test("PATCH - Partially update Spot Trade", async ({ request }) => {
    const patchData = { exchangeRate: 0.8 };
    const patchResponse = await request.patch(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`,
      { data: patchData }
    );
    expect(patchResponse.status()).toBe(200);

    const updatedTrade = await request
      .get(`${API_BASE_URL}/trades/${SPOT_TRADE_ID}`)
      .then((res) => res.json());
    expect(updatedTrade.exchangeRate).toBe(0.8);
  });

  // DELETE - Remove Spot Trade
  test("DELETE - Remove Spot Trade", async ({ request }) => {
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
