import { test, expect } from "@playwright/test";
import { compareData } from "../../../fixtures/compareData";
import counterpartyData from "../../../../reference-data/counterpartyData.json";

const API_BASE_URL = "http://localhost:3000/api";

test.describe.configure({ mode: "serial" });

test("GET /counterparties - Validate Counterparty Data", async ({
  request,
}) => {
  console.log("Fetching all counterparties...");
  const response = await request.get(`${API_BASE_URL}/counterparties`);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  console.log("Filtering out dynamically created counterparties...");
  const filteredResponse = responseBody.filter(
    (counterparty: any) => counterparty.id !== "CPTY001"
  );

  console.log("Comparing filtered API response with reference data...");
  await compareData(filteredResponse, counterpartyData);
});
