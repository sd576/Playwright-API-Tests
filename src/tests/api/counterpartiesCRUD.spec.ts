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

test.describe("Counterparty API - CRUD Operations", () => {
  test.beforeEach(async ({ request }) => {
    console.log(`♻️ Ensuring ${COUNTERPARTY_ID} exists before test...`);

    // Delete if exists
    await request.delete(`${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`);

    // Recreate
    const postResponse = await request.post(`${API_BASE_URL}/counterparties`, {
      data: newCounterparty,
    });

    if (postResponse.status() !== 201) {
      throw new Error(`❌ Failed to create ${COUNTERPARTY_ID}`);
    }
    console.log(`✅ Created ${COUNTERPARTY_ID}`);
  });

  test("GET - Validate newly created counterparty", async ({ request }) => {
    console.log("🔍 Fetching CPTY001...");
    const getResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newCounterparty);
  });

  test("PUT - Update counterparty", async ({ request }) => {
    console.log("🚀 Updating CPTY001...");

    const updatedData = {
      ...newCounterparty,
      name: "Updated Counterparty",
      phone: "+442076543210",
    };

    console.log(
      "🔍 Sending PUT request to:",
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    console.log("📦 Request Body: ", JSON.stringify(updatedData, null, 2));

    const putResponse = await request.put(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`,
      {
        headers: { "Content-Type": "application/json" },
        data: updatedData,
      }
    );

    console.log("🔍 PUT Response Status:", putResponse.status());
    console.log("📩 PUT Response Body:", await putResponse.text());

    expect(putResponse.status()).toBe(200);
  });

  test("DELETE - Remove counterparty", async ({ request }) => {
    console.log("🚀 Deleting CPTY001...");
    const deleteResponse = await request.delete(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(deleteResponse.status()).toBe(204);
  });
});
