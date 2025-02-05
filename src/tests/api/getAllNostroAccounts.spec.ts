import { test, expect } from "../../hooks/apiHooks";
import { compareData } from "../../fixtures/compareData";
import settlementData from "../../../reference-data/settlementData.json";
import { resolve } from "path";

test.describe.configure({ mode: "serial" });

test("GET All FX Settlement Nostro accounts", async ({ request }) => {
  console.log("Waiting for the database to settle...");
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Fetching all the FX Nostro accounts");
  const response = await request.get(
    "http://localhost:3000/api/nostro-accounts"
  );

  console.log("GET Response Status: ", response.status());
  console.log("GET Response Body: ", await response.text());

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  await compareData(responseBody, settlementData);
});
