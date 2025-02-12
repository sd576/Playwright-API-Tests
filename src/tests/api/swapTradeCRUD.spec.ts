import { test, expect, request, APIRequestContext } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api";
const SWAP_TRADE_ID = "SWAP-TEST-001";

test.describe("Swap Trade CRUD Operations", () => {
  let apiRequest: APIRequestContext;

  test.beforeAll(async () => {
    apiRequest = await request.newContext();
    console.log("♻️ Ensuring SWAP-TEST-001 does not exist before test...");
    await apiRequest.delete(`${API_BASE_URL}/trades/${SWAP_TRADE_ID}`);
  });

  test("POST - Create new Swap Trade", async () => {
    console.log("✅ Creating SWAP-TEST-001...");
    const newSwapTrade = {
      tradeId: SWAP_TRADE_ID,
      tradeType: "SWAP",
      parentTradeId: null,
      tradeDate: "2025-02-27",
      settlementDate: "2025-03-30",
      weBuyWeSell: "we sell",
      counterpartyId: "003",
      counterpartyName: "Barclays Bank",
      buyCurrency: "EUR",
      sellCurrency: "USD",
      buyAmount: 1500000,
      sellAmount: 1650000,
      exchangeRate: 1.1,
      buyNostroAccountId: "003-EUR",
      sellNostroAccountId: "003-USD",
    };

    const postResponse = await apiRequest.post(`${API_BASE_URL}/trades`, {
      data: newSwapTrade,
    });

    expect(postResponse.status()).toBe(201);

    const getResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    const responseBody = await getResponse.json();

    expect(responseBody).toMatchObject(newSwapTrade);
  });

  test("GET - Retrieve Swap Trade", async () => {
    console.log("🔍 Fetching Swap Trade...");
    const getResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);

    const responseBody = await getResponse.json();
    expect(responseBody.tradeId).toBe(SWAP_TRADE_ID);
  });

  test("PUT - Fully update Swap Trade", async () => {
    console.log("🚀 Performing full update via PUT...");
    const updatedTrade = {
      tradeType: "SWAP",
      parentTradeId: "SWAP-BASE-001",
      tradeDate: "2025-03-01",
      settlementDate: "2025-04-05",
      weBuyWeSell: "we buy",
      counterpartyId: "004",
      counterpartyName: "Lloyds Bank",
      buyCurrency: "USD",
      sellCurrency: "JPY",
      buyAmount: 1200000,
      sellAmount: 140000000,
      exchangeRate: 116.67,
      buyNostroAccountId: "004-USD",
      sellNostroAccountId: "004-JPY",
    };

    const putResponse = await apiRequest.put(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`,
      {
        data: updatedTrade,
      }
    );

    expect(putResponse.status()).toBe(200);

    const getUpdatedResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    const responseBody = await getUpdatedResponse.json();

    expect(responseBody).toMatchObject(updatedTrade);
  });

  test("PATCH - Partially update Swap Trade", async () => {
    console.log("🚀 Performing partial update via PATCH...");
    const patchData = {
      settlementDate: "2025-04-15",
      weBuyWeSell: "we sell",
    };

    const patchResponse = await apiRequest.patch(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`,
      {
        data: patchData,
      }
    );

    expect(patchResponse.status()).toBe(200);

    const getPatchedResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    const responseBody = await getPatchedResponse.json();

    expect(responseBody.settlementDate).toBe(patchData.settlementDate);
    expect(responseBody.weBuyWeSell).toBe(patchData.weBuyWeSell);
  });

  test("DELETE - Remove Swap Trade", async () => {
    console.log("🚀 Deleting Swap Trade SWAP-TEST-001...");
    const deleteResponse = await apiRequest.delete(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    expect(deleteResponse.status()).toBe(204);

    const getDeletedResponse = await apiRequest.get(
      `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`
    );
    expect(getDeletedResponse.status()).toBe(404);
  });

  test.afterAll(async () => {
    await apiRequest.dispose();
  });
});
