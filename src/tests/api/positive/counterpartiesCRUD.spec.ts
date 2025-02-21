import { test, expect } from "@playwright/test";
import {
  waitForServerReady,
  ensureResourceClean,
} from "../../../fixtures/serverSetup";

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
  test.beforeEach(async ({ request }, testInfo) => {
    console.log(`🔄 Running setup for test: ${testInfo.title}`);

    if (testInfo.title.includes("Retrieve all counterparties")) {
      console.log("📌 Skipping cleanup for GET all counterparties.");
      return;
    }

    if (process.env.CI) {
      console.log("🔄 Running server readiness check in pipeline...");
      await waitForServerReady(request, `${API_BASE_URL}/counterparties`);
    }

    await ensureResourceClean(
      request,
      `${API_BASE_URL}/counterparties`,
      COUNTERPARTY_ID,
      newCounterparty
    );
  });

  // POST - Create
  test("POST - Create new counterparty", async ({ request }) => {
    const getResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newCounterparty);
  });

  // GET - Retrieve
  test("GET - Retrieve counterparty", async ({ request }) => {
    const getResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newCounterparty);
  });

  // PUT - Full Update
  test("PUT - Fully update counterparty", async ({ request }) => {
    const updatedData = {
      ...newCounterparty,
      name: "Updated Counterparty",
      city: "New York",
      country: "USA",
    };

    const putResponse = await request.put(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`,
      {
        data: updatedData,
      }
    );

    expect(putResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(await getUpdatedResponse.json()).toMatchObject(updatedData);
  });

  // PATCH - Partial Update
  test("PATCH - Partially update counterparty", async ({ request }) => {
    const patchData = { name: "Partially Updated Counterparty" };

    const patchResponse = await request.patch(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`,
      {
        data: patchData,
      }
    );

    expect(patchResponse.status()).toBe(200);

    const getUpdatedResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    const updatedCounterparty = await getUpdatedResponse.json();
    expect(updatedCounterparty.name).toBe("Partially Updated Counterparty");
  });

  // DELETE - Remove
  test("DELETE - Remove counterparty", async ({ request }) => {
    const deleteResponse = await request.delete(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(deleteResponse.status()).toBe(204);

    const getDeletedResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    expect(getDeletedResponse.status()).toBe(404);
  });
});
