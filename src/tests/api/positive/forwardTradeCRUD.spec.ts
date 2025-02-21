import { test, expect } from "@playwright/test";
import {
  waitForServerReady,
  ensureResourceClean,
} from "../../../fixtures/serverSetup";

const API_BASE_URL = "http://localhost:3000/api";
const FORWARD_TRADE_ID = "FWD-TEST-001";

const newForwardTrade = {
  tradeId: FORWARD_TRADE_ID,
  tradeType: "FORWARD",
  tradeDate: "2025-02-10",
  settlementDate: "2025-03-10",
  weBuyWeSell: "we buy",
  counterpartyId: "CPTY001",
  buyCurrency: "EUR",
  sellCurrency: "USD",
  buyAmount: 1000000,
  sellAmount: 1050000,
  exchangeRate: 1.05,
  buyNostroAccountId: "001-EUR",
  sellNostroAccountId: "002-USD",
};

test.describe("Forward Trade API - Full CRUD Operations", () => {
  test.beforeEach(async ({ request }, testInfo) => {
    console.log(`🔄 Running setup for test: ${testInfo.title}`);

    if (process.env.CI) {
      console.log("🔄 Running server readiness check in pipeline...");
      await waitForServerReady(request, `${API_BASE_URL}/trades`);
    }

    await ensureResourceClean(
      request,
      `${API_BASE_URL}/trades`,
      FORWARD_TRADE_ID,
      newForwardTrade
    );
  });

  // ✅ 1. POST - Create Forward Trade
  test("POST - Create new Forward Trade", async ({ request }) => {
    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newForwardTrade);
  });

  // ✅ 2. GET - Retrieve Forward Trade
  test("GET - Retrieve Forward Trade", async ({ request }) => {
    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newForwardTrade);
  });

  // ✅ 3. PUT - Fully Update Forward Trade
  test("PUT - Fully update Forward Trade", async ({ request }) => {
    const updatedData = {
      ...newForwardTrade,
      buyAmount: 1200000,
      sellAmount: 1260000,
    };
    const putResponse = await request.put(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`,
      { data: updatedData }
    );
    expect(putResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    expect(await getUpdatedResponse.json()).toMatchObject(updatedData);
  });

  // ✅ 4. PATCH - Partial Update (Change settlementDate)
  test("PATCH - Partially update Forward Trade", async ({ request }) => {
    const patchData = { settlementDate: "2025-03-15" };
    const patchResponse = await request.patch(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`,
      { data: patchData }
    );
    expect(patchResponse.status()).toBe(200);

    const updatedTrade = await request
      .get(`${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`)
      .then((res) => res.json());
    expect(updatedTrade.settlementDate).toBe("2025-03-15");
  });

  // ✅ 5. DELETE - Remove Forward Trade
  test("DELETE - Remove Forward Trade", async ({ request }) => {
    const deleteResponse = await request.delete(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    expect(deleteResponse.status()).toBe(204);

    const getDeletedResponse = await request.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    expect(getDeletedResponse.status()).toBe(404);
  });
});
