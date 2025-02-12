import { test, expect } from "@playwright/test";

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

const normalizeDates = (trade: any) => ({
  ...trade,
  tradeDate: new Date(parseFloat(trade.tradeDate)).toISOString().split("T")[0],
  settlementDate: new Date(parseFloat(trade.settlementDate))
    .toISOString()
    .split("T")[0],
});

test.describe("Spot Trade CRUD Operations", () => {
  // ✅ 1. POST - Create Spot Trade
  test("POST - Create new Spot Trade", async ({ request }) => {
    console.log(`♻️ Ensuring ${SPOT_TRADE_ID} does not exist before test...`);
    await request.delete(`${API_BASE_URL}/trades/${SPOT_TRADE_ID}`);

    console.log(`✅ Creating ${SPOT_TRADE_ID}...`);
    const postResponse = await request.post(`${API_BASE_URL}/trades`, {
      data: newSpotTrade,
    });

    expect(postResponse.status()).toBe(201);
    console.log(`✅ Spot Trade ${SPOT_TRADE_ID} created successfully.`);
  });

  // ✅ 2. GET - Retrieve Spot Trade
  test("GET - Retrieve Spot Trade", async ({ request }) => {
    console.log("🔍 Fetching Spot Trade...");
    const getResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(getResponse.status()).toBe(200);

    const responseBody = normalizeDates(await getResponse.json());
    expect(responseBody).toMatchObject(newSpotTrade);
  });

  // ✅ 3. PUT - Fully update Spot Trade
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

  // ✅ 4. PATCH - Partially update Spot Trade
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
    const patchedTrade = await getPatchedResponse.json();
    expect(patchedTrade.weBuyWeSell).toBe("we sell");
  });

  // ✅ 5. DELETE - Remove Spot Trade
  test("DELETE - Remove Spot Trade", async ({ request }) => {
    console.log("🚀 Deleting Spot Trade...");
    const deleteResponse = await request.delete(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(deleteResponse.status()).toBe(200);

    const getDeletedResponse = await request.get(
      `${API_BASE_URL}/trades/${SPOT_TRADE_ID}`
    );
    expect(getDeletedResponse.status()).toBe(404);
  });
});
