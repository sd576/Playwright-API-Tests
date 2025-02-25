import { test, expect } from "@playwright/test";
import { compareData } from "../../../fixtures/compareData";
import nostroAccountData from "../../../../reference-data/nostroData.json";

const API_BASE_URL = "http://localhost:3000/api";

test.describe.configure({ mode: "serial" });

test("GET /nostro-accounts - Validate Nostro Account Data", async ({
  request,
}) => {
  console.log("Waiting for the database to settle...");
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Fetching all Nostro Accounts...");
  const response = await request.get(`${API_BASE_URL}/nostro-accounts`);

  console.log("GET Response Status: ", response.status());
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  console.log("GET Response Body: ", responseBody);

  // Define dynamically created test records to exclude
  const testRecordIds = ["002-CHF", "CPTY001"];

  // Filter API response to remove test records
  const filteredResponse = responseBody.filter(
    (entry: { id: string }) => !testRecordIds.includes(entry.id)
  );

  // Filter `nostroAccountData.json` to also remove test records
  const filteredExpectedData = nostroAccountData.filter(
    (entry: { id: string }) => !testRecordIds.includes(entry.id)
  );

  console.log(
    "Filtering out dynamically created test records before comparison..."
  );
  console.log("🧐 Filtered API Response:", filteredResponse);
  console.log("📑 Filtered Expected Data:", filteredExpectedData);

  // Compare filtered API response with filtered expected data
  await compareData(filteredResponse, filteredExpectedData);
});
