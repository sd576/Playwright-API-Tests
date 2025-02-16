import { test, expect } from "@playwright/test";
import { compareData } from "../../fixtures/compareData";
import tradeData from "../../../reference-data/allTradeData.json";

const API_BASE_URL = "http://localhost:3000/api";

test.describe.configure({ mode: "serial" });

test("GET /trades - Validate Trade Data", async ({ request }) => {
  console.log("Fetching all trades...");
  const response = await request.get(`${API_BASE_URL}/trades`);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  console.log("Filtering out dynamically created trades...");
  const filteredResponse = responseBody.filter(
    (trade: any) =>
      trade.tradeId !== "SPOT-TEST-001" && trade.tradeId !== "FWD-TEST-001"
  );

  console.log("Comparing filtered API response with reference data...");
  await compareData(filteredResponse, tradeData);
});
