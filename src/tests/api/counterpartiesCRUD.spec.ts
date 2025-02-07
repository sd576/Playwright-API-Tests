import { test, expect } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api";
const COUNTERPARTY_ID = "CPTY001";

const newCounterparty = {
  id: COUNTERPARTY_ID,
  name: "Test Counterparty",
  city: "London",
  country: "United Kingdom",
  currency: "GBP",
  accountNumber: "11112222",
  swiftCode: "TESTGB00",
  contactPerson: "John Doe",
  email: "john.doe@example.com",
  phone: "+44 207000000",
};

test.describe("Counterparty API - Full CRUD Operations", () => {
  test.beforeEach(async ({ request }) => {
    console.log(`♻️ Ensuring ${COUNTERPARTY_ID} does not exist before test...`);
    await request.delete(`${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`);

    console.log(`✅ Creating ${COUNTERPARTY_ID}...`);
    const postResponse = await request.post(`${API_BASE_URL}/counterparties`, {
      data: newCounterparty,
    });

    if (postResponse.status() !== 201) {
      throw new Error(`❌ Failed to create ${COUNTERPARTY_ID}`);
    }
  });

  // ✅ 1. POST - Create Counterparty
  test("POST - Create new counterparty", async ({ request }) => {
    console.log("🔍 Fetching newly created counterparty...");
    const getResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newCounterparty);
  });

  // ✅ 2. GET - Retrieve Counterparty
  test("GET - Retrieve counterparty", async ({ request }) => {
    console.log("🔍 Fetching counterparty...");
    const getResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newCounterparty);
  });

  // ✅ 3. PUT - Full Update (Requires all fields)
  test("PUT - Fully update counterparty", async ({ request }) => {
    console.log("🚀 Performing full update via PUT...");

    const updatedData = {
      id: COUNTERPARTY_ID,
      name: "Updated Counterparty",
      city: "New York",
      country: "USA",
      currency: "USD",
      accountNumber: "99998888",
      swiftCode: "UPDSWIFT11",
      contactPerson: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 555 9999",
    };

    const putResponse = await request.put(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`,
      { data: updatedData }
    );

    console.log("🔍 PUT Response Status:", putResponse.status());
    expect(putResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(getUpdatedResponse.status()).toBe(200);
    expect(await getUpdatedResponse.json()).toMatchObject(updatedData);
  });

  // ✅ 4. PATCH - Partial Update (Only updates name)
  test("PATCH - Partially update counterparty", async ({ request }) => {
    console.log("🚀 Performing partial update via PATCH...");

    const patchData = { name: "Partially Updated Counterparty" };

    const patchResponse = await request.patch(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`,
      { data: patchData }
    );

    console.log("🔍 PATCH Response Status:", patchResponse.status());
    expect(patchResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );

    const updatedCounterparty = await getUpdatedResponse.json();
    expect(updatedCounterparty.name).toBe("Partially Updated Counterparty");
  });

  // ✅ 5. DELETE - Remove Counterparty
  test("DELETE - Remove counterparty", async ({ request }) => {
    console.log("🚀 Deleting counterparty...");
    const deleteResponse = await request.delete(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(deleteResponse.status()).toBe(204);

    // Ensure it's gone
    const getDeletedResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(getDeletedResponse.status()).toBe(404);
  });
});
