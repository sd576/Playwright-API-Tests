import { test, expect } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api";

// Define a new Nostro Account to perform CRUD on
const newNostroAccount = {
  id: "002-CHF",
  counterpartyId: "002",
  currency: "CHF",
  nostroAccountId: "020",
  nostroDescription: "020 - CHF Nostro Account managed by UBS AG",
  managedById: "020",
};

// Ensure all tests run serially
test.describe.configure({ mode: "serial" });

test.describe("Nostro Account CRUD Operations", () => {
  let createdNostroId: string; // Persist the ID between tests

  test("POST / Create a new Nostro Account", async ({ request }) => {
    console.log(
      "[ℹ️ INFO] Checking if Nostro Account exists before creation..."
    );

    // Attempt to GET the Nostro Account first
    const getResponse = await request.get(
      `${API_BASE_URL}/nostro-accounts/002-CHF`
    );

    if (getResponse.status() === 200) {
      console.log("[⚠️ WARNING] Nostro Account exists. Deleting it first...");

      const deleteResponse = await request.delete(
        `${API_BASE_URL}/nostro-accounts/002-CHF`
      );
      console.log("[ℹ️ INFO] DELETE Response Status:", deleteResponse.status());

      expect(deleteResponse.status()).toBe(204);
    } else {
      console.log("[✅ SUCCESS] Nostro Account does not exist. Proceeding...");
    }

    console.log("[🚀 ACTION] Creating Nostro Account: 002-CHF");

    const postResponse = await request.post(`${API_BASE_URL}/nostro-accounts`, {
      data: newNostroAccount,
    });

    console.log("[ℹ️ INFO] POST Response Status:", postResponse.status());
    console.log("[ℹ️ INFO] POST Response Body:", await postResponse.text());
    expect(postResponse.status()).toBe(201);

    const postResponseBody = await postResponse.json();
    createdNostroId = postResponseBody.id;
    console.log(`[✅ SUCCESS] Stored createdNostroId: ${createdNostroId}`);
  });

  test("GET / Retrieve the newly created Nostro Account", async ({
    request,
  }) => {
    if (!createdNostroId)
      throw new Error(
        "[❌ ERROR] No Nostro Account ID found from previous test!"
      );

    console.log(`[🔍 FETCH] Retrieving Nostro Account: ${createdNostroId}`);

    const getResponse = await request.get(
      `${API_BASE_URL}/nostro-accounts/${createdNostroId}`
    );

    console.log("[ℹ️ INFO] GET Response Status:", getResponse.status());
    expect(getResponse.status()).toBe(200);

    const responseBody = await getResponse.json();
    expect(responseBody).toMatchObject(newNostroAccount);
  });

  test("DELETE / Delete the created Nostro Account", async ({ request }) => {
    if (!createdNostroId)
      throw new Error(
        "[❌ ERROR] No Nostro Account ID found from previous test!"
      );

    console.log(`[🗑️ DELETE] Removing Nostro Account: ${createdNostroId}`);

    const deleteResponse = await request.delete(
      `${API_BASE_URL}/nostro-accounts/${createdNostroId}`
    );

    console.log("[ℹ️ INFO] DELETE Response Status:", deleteResponse.status());
    expect(deleteResponse.status()).toBe(204);

    // Verify the account is actually deleted by attempting to fetch it
    const getResponse = await request.get(
      `${API_BASE_URL}/nostro-accounts/${createdNostroId}`
    );
    console.log(
      "[ℹ️ INFO] GET After DELETE Response Status:",
      getResponse.status()
    );

    expect(getResponse.status()).toBe(404);
  });
});
