import { test, expect } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api";
const SWAP_TRADE_ID = "SWAP-025-100";

test("GET - Retrieve Swap Trade", async ({ request }) => {
  const url = `${API_BASE_URL}/trades/${SWAP_TRADE_ID}`;

  console.log("🔍 GET Request URL:", url);

  const getResponse = await request.get(url);

  console.log("🔍 Response Status:", getResponse.status());
  console.log("🔍 Response Body:", await getResponse.text());

  expect(getResponse.status()).toBe(200);

  const responseBody = await getResponse.json();
  console.log("🔍 Retrieved Trade Data:", responseBody);

  expect(responseBody.tradeId).toBe(SWAP_TRADE_ID);
});
