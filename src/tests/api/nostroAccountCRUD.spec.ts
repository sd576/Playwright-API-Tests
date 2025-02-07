import { test, expect } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api";
const NOSTRO_ID = "002-CHF";

const newNostroAccount = {
  id: NOSTRO_ID,
  counterpartyId: "002",
  currency: "CHF",
  nostroAccountId: "020",
  nostroDescription: "020 - CHF Nostro Account managed by UBS AG",
  managedById: "020",
};

test.describe("Nostro Account CRUD Operations", () => {
  test.beforeEach(async ({ request }) => {
    console.log(`♻️ Ensuring ${NOSTRO_ID} exists before test...`);

    // Delete if exists
    await request.delete(`${API_BASE_URL}/nostro-accounts/${NOSTRO_ID}`);

    // Recreate
    const postResponse = await request.post(`${API_BASE_URL}/nostro-accounts`, {
      data: newNostroAccount,
    });

    if (postResponse.status() !== 201) {
      throw new Error(`❌ Failed to create ${NOSTRO_ID}`);
    }
    console.log(`✅ Created ${NOSTRO_ID}`);
  });

  test("GET / Retrieve the newly created Nostro Account", async ({
    request,
  }) => {
    console.log(`[🔍 GET] Fetching Nostro Account: ${NOSTRO_ID}`);
    const getResponse = await request.get(
      `${API_BASE_URL}/nostro-accounts/${NOSTRO_ID}`
    );
    expect(getResponse.status()).toBe(200);
  });

  test("DELETE / Remove Nostro Account", async ({ request }) => {
    console.log(`[🗑️ DELETE] Removing Nostro Account: ${NOSTRO_ID}`);
    const deleteResponse = await request.delete(
      `${API_BASE_URL}/nostro-accounts/${NOSTRO_ID}`
    );
    expect(deleteResponse.status()).toBe(204);
  });
});
