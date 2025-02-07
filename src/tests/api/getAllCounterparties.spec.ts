import { test, expect } from "@playwright/test";
import { compareData } from "../../fixtures/compareData";
import counterpartyData from "../../../reference-data/counterpartyData.json";

test.describe.configure({ mode: "serial" });

test("GET /counterparties - Validate Counterparty Data", async ({
  request,
}) => {
  console.log("Waiting for the database to settle...");
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Fetching all counterparties...");
  const response = await request.get(
    "http://localhost:3000/api/nostro-accounts/counterparties"
  );

  console.log("GET Response Status: ", response.status());
  console.log("GET Response Body:", await response.text());
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  console.log("GET Response Body: ", responseBody);

  await compareData(responseBody, counterpartyData);
});
