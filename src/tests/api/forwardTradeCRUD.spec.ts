import { test, expect } from "@playwright/test";
import {
  waitForServerReady,
  ensureResourceClean,
} from "../../fixtures/serverSetup";

const API_BASE_URL = "http://localhost:3000/api";
const FORWARD_TRADE_ID = "FWD-TEST-001";

const newForwardTrade = {
  tradeId: FORWARD_TRADE_ID,
  tradeType: "FORWARD",
  parentTradeId: null,
  tradeDate: "2025-02-27",
  settlementDate: "2025-03-30",
  weBuyWeSell: "we sell",
  counterpartyId: "001",
  buyCurrency: "EUR",
  sellCurrency: "USD",
  buyAmount: 1000000,
  sellAmount: 1100000,
  exchangeRate: 1.1,
  buyNostroAccountId: "001-EUR",
  sellNostroAccountId: "001-USD",
};

test.beforeEach(async ({ request }) => {
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

test.describe("Forward Trade CRUD Operations", () => {
  test("POST - Create new Forward Trade", async ({ request }) => {
    console.log(`✅ Creating ${FORWARD_TRADE_ID}...`);
    const postResponse = await request.post(`${API_BASE_URL}/trades`, {
      data: newForwardTrade,
    });
    expect(postResponse.status()).toBe(201);

    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);
    console.log("GET Response after POST:", await getResponse.json());
  });

  test("GET - Retrieve Forward Trade", async ({ request }) => {
    console.log("🔍 Fetching Forward Trade...");
    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);

    const responseBody = await getResponse.json();
    console.log(responseBody);
    expect(responseBody.tradeId).toBe(FORWARD_TRADE_ID);
  });

  test("PUT - Fully update Forward Trade", async ({ request }) => {
    console.log("🚀 Performing full update via PUT...");
    const updatedTrade = {
      ...newForwardTrade,
      parentTradeId: "FWD-BASE-001",
      tradeDate: "2025-02-28",
      settlementDate: "2025-04-01",
      weBuyWeSell: "we buy",
      counterpartyId: "002",
      buyCurrency: "USD",
      sellCurrency: "EUR",
      buyAmount: 1100000,
      sellAmount: 1000000,
      exchangeRate: 0.91,
      buyNostroAccountId: "002-USD",
      sellNostroAccountId: "002-EUR",
    };

    const putResponse = await request.put(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`,
      {
        data: updatedTrade,
      }
    );
    expect(putResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    const responseBody = await getUpdatedResponse.json();
    expect(responseBody).toMatchObject(updatedTrade);
  });

  test("PATCH - Partially update Forward Trade", async ({ request }) => {
    console.log("🚀 Performing partial update via PATCH...");
    const patchData = {
      settlementDate: "2025-04-15",
      weBuyWeSell: "we sell",
    };

    const patchResponse = await request.patch(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`,
      {
        data: patchData,
      }
    );
    expect(patchResponse.status()).toBe(200);

    const getPatchedResponse = await request.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    const responseBody = await getPatchedResponse.json();

    expect(responseBody.settlementDate).toBe(patchData.settlementDate);
    expect(responseBody.weBuyWeSell).toBe(patchData.weBuyWeSell);
  });

  test("DELETE - Remove Forward Trade", async ({ request }) => {
    console.log(`🚀 Deleting Forward Trade ${FORWARD_TRADE_ID}...`);
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
