import { test, expect } from "@playwright/test";
import { compareTrades } from "../../fixtures/compareTrades";
import allTradeData from "../../../reference-data/allTradeData.json";

const API_BASE_URL = "http://localhost:3000/api";

test.describe.configure({ mode: "serial" });

test("GET /trades - Validate All Trade Data", async ({ request }) => {
  console.log("Fetching all trades...");
  const response = await request.get(`${API_BASE_URL}/trades`);
  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  console.log("Comparing API response with trade data...");
  compareTrades(responseBody, allTradeData);
});
