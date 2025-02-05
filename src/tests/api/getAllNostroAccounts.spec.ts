import { test, expect } from "../../hooks/apiHooks";
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
    "http://localhost:3000/api/counterparties"
  );

  console.log("GET Response Status: ", response.status());
  console.log("GET Response Body: ", await response.text());

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  await compareData(responseBody, counterpartyData);
});
