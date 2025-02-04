import { test as base, expect, APIRequestContext } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000/api";
const COUNTERPARTY_ID = "CPTY001";

export const test = base.extend<{ requestContext: APIRequestContext }>({
  requestContext: async ({ request }, use) => {
    await use(request);
  },
});

// Before tests: Ensure CPTY001 does not exist, but DON’T reset the whole DB
test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
  console.log(`🔄 Global setup: Ensuring ${COUNTERPARTY_ID} does not exist`);

  const deleteResponse = await request.delete(
    `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
  );
  if (deleteResponse.status() === 204) {
    console.log(`✅ Successfully deleted ${COUNTERPARTY_ID} before tests.`);
  } else {
    console.log(`ℹ️ ${COUNTERPARTY_ID} did not exist before tests.`);
  }

  // Debug: Check existing counterparties before tests
  const res = await request.get(`${API_BASE_URL}/counterparties`);
  const existingData = await res.json();
  console.log("📝 Counterparties before tests:", existingData);
});

// After all tests: Ensure CPTY001 is deleted (just in case)
test.afterAll(async ({ request }: { request: APIRequestContext }) => {
  console.log(`🧹 Global teardown: Deleting ${COUNTERPARTY_ID}`);

  const deleteResponse = await request.delete(
    `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
  );
  if (deleteResponse.status() === 204) {
    console.log(`Successfully deleted ${COUNTERPARTY_ID} after tests.`);
  } else {
    console.log(`${COUNTERPARTY_ID} did not exist after tests.`);
  }

  // Debug: Check existing counterparties after tests
  const res = await request.get(`${API_BASE_URL}/counterparties`);
  const existingData = await res.json();
  console.log("Counterparties after tests:", existingData);
});

export { expect };
