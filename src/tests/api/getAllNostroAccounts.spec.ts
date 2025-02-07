import { test, expect } from "@playwright/test";
import { compareData } from "../../fixtures/compareData";
import nostroAccountData from "../../../reference-data/nostroData.json";

test.describe.configure({ mode: "serial" });

test("GET /nostro-accounts - Validate Nostro Account Data", async ({
  request,
}) => {
  console.log("Waiting for the database to settle...");
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Fetching all Nostro Accounts...");
  const response = await request.get(
    "http://localhost:3000/api/nostro-accounts"
  );

  console.log("GET Response Status: ", response.status());
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  console.log("GET Response Body: ", responseBody);

  // 🔹 Filter out dynamically created test records before comparison
  const testRecordIds = ["002-CHF", "CPTY001"]; // Add other test records if needed
  const filteredData = responseBody.filter(
    (entry: any) => !testRecordIds.includes(entry.id)
  );

  console.log(
    "✅ Filtering out dynamically created test records before comparison..."
  );
  await compareData(filteredData, nostroAccountData);
});
