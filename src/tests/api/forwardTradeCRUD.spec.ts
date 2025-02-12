import { test, expect, request, APIRequestContext } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api";
const FORWARD_TRADE_ID = "FWD-TEST-001";

test.describe("Forward Trade CRUD Operations", () => {
  let apiRequest: APIRequestContext;

  test.beforeAll(async () => {
    apiRequest = await request.newContext();
    console.log("♻️ Ensuring FWD-TEST-001 does not exist before test...");
    await apiRequest.delete(`${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`);
  });

  test("POST - Create new Forward Trade", async () => {
    console.log("✅ Creating FWD-TEST-001...");
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

    const postResponse = await apiRequest.post(`${API_BASE_URL}/trades`, {
      data: newForwardTrade,
    });

    expect(postResponse.status()).toBe(201);

    const getResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    const responseBody = await getResponse.json();

    expect(responseBody).toMatchObject(newForwardTrade);
  });

  test("GET - Retrieve Forward Trade", async () => {
    console.log("🔍 Fetching Forward Trade...");
    const getResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);

    const responseBody = await getResponse.json();
    expect(responseBody.tradeId).toBe(FORWARD_TRADE_ID);
  });

  test("PUT - Fully update Forward Trade", async () => {
    console.log("🚀 Performing full update via PUT...");
    const updatedTrade = {
      tradeType: "FORWARD",
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

    const putResponse = await apiRequest.put(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`,
      {
        data: updatedTrade,
      }
    );

    expect(putResponse.status()).toBe(200);

    const getUpdatedResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    const responseBody = await getUpdatedResponse.json();

    expect(responseBody).toMatchObject(updatedTrade);
  });

  test("PATCH - Partially update Forward Trade", async () => {
    console.log("🚀 Performing partial update via PATCH...");
    const patchData = {
      settlementDate: "2025-04-15",
      weBuyWeSell: "we sell",
    };

    const patchResponse = await apiRequest.patch(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`,
      {
        data: patchData,
      }
    );

    expect(patchResponse.status()).toBe(200);

    const getPatchedResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    const responseBody = await getPatchedResponse.json();

    expect(responseBody.settlementDate).toBe(patchData.settlementDate);
    expect(responseBody.weBuyWeSell).toBe(patchData.weBuyWeSell);
  });

  test("DELETE - Remove Forward Trade", async () => {
    console.log("🚀 Deleting Forward Trade FWD-TEST-001...");
    const deleteResponse = await apiRequest.delete(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );

    // Expect 204 No Content
    expect(deleteResponse.status()).toBe(204);

    // Confirm the trade no longer exists
    const getDeletedResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${FORWARD_TRADE_ID}`
    );
    expect(getDeletedResponse.status()).toBe(404);
  });

  test.afterAll(async () => {
    await apiRequest.dispose();
  });
});
