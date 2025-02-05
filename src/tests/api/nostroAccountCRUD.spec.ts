import { test, expect } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api";

// Define a new Nostro Account to perform CRUD on
const newNostroAccount = {
  settlementId: "002-CHF",
  counterpartyId: "002",
  counterpartyName: "UBS AG",
  currency: "CHF",
  nostroAccountId: "020",
  nostroDescription: "020 - CHF Nostro Account managed by UBS AG",
  managedById: "020",
  managedByName: "Credit Suisse",
};

// Ensure all tests run serially
test.describe.configure({ mode: "serial" });

test.describe("Nostro Account CRUD Operations", () => {
  test("POST / Create a new Nostro Account", async ({ request }) => {
    console.log("Creating Nostro Account: 002-CHF");

    const postResponse = await request.post(`${API_BASE_URL}/nostro-accounts`, {
      data: newNostroAccount,
    });

    console.log("POST Response Status: ", postResponse.status());
    console.log("POST Response Body: ", await postResponse.text());

    expect(postResponse.status()).toBe(201);

    // Wait to ensure DB commit
    console.log("Waiting 500 milliseconds...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const postResponseBody = await postResponse.json();
    console.log("Parsed Response Body: ", postResponseBody);
  });
});
