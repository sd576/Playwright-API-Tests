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

  test("PUT / Update the entire Nostro Account", async ({ request }) => {
    if (!createdNostroId)
      throw new Error(
        "[❌ ERROR] No Nostro Account ID found from previous test!"
      );

    console.log(`[📝 UPDATE] Updating Nostro Account: ${createdNostroId}`);

    const updatedNostroAccount = {
      id: "002-CHF",
      counterpartyId: "003", // Changed
      currency: "EUR", // Changed
      nostroAccountId: "021", // Changed
      nostroDescription: "021 - EUR Nostro Account managed by Deutsche Bank", // Changed
      managedById: "021", // Changed
    };

    const putResponse = await request.put(
      `${API_BASE_URL}/nostro-accounts/${createdNostroId}`,
      { data: updatedNostroAccount }
    );

    console.log("[ℹ️ INFO] PUT Response Status:", putResponse.status());
    expect(putResponse.status()).toBe(200);

    // Verify update
    const getResponse = await request.get(
      `${API_BASE_URL}/nostro-accounts/${createdNostroId}`
    );
    const getResponseBody = await getResponse.json();

    console.log("[🔍 FETCH AFTER UPDATE] GET Response Body:", getResponseBody);
    expect(getResponseBody).toMatchObject(updatedNostroAccount);
  });

  test("PATCH / Partially update the Nostro Account", async ({ request }) => {
    console.log(
      "[🛠️ PATCH] Fetching current Nostro Account to determine update..."
    );

    // 🔹 Step 1: Fetch the existing record
    const getResponse = await request.get(
      `${API_BASE_URL}/nostro-accounts/002-CHF`
    );
    expect(getResponse.status()).toBe(200);

    const existingData = await getResponse.json();
    console.log("[🔍 FETCHED RECORD BEFORE PATCH]:", existingData);

    // 🔹 Step 2: Determine new currency value (toggle CHF <-> EUR)
    const newCurrency = existingData.currency === "CHF" ? "EUR" : "CHF";

    // 🔹 Step 3: Send PATCH request with updated currency
    console.log(
      `[🛠️ PATCH] Updating currency from ${existingData.currency} to ${newCurrency}...`
    );

    const patchResponse = await request.patch(
      `${API_BASE_URL}/nostro-accounts/002-CHF`,
      {
        data: { currency: newCurrency },
      }
    );

    console.log("[ℹ️ INFO] PATCH Response Status:", patchResponse.status());
    expect(patchResponse.status()).toBe(200);

    // 🔹 Step 4: Verify PATCH update
    const getAfterPatchResponse = await request.get(
      `${API_BASE_URL}/nostro-accounts/002-CHF`
    );
    console.log(
      "[🔍 FETCH AFTER PATCH] GET Response Body:",
      await getAfterPatchResponse.json()
    );
    expect(getAfterPatchResponse.status()).toBe(200);

    const updatedData = await getAfterPatchResponse.json();
    expect(updatedData.currency).toBe(newCurrency); // ✅ Ensure currency is toggled
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
