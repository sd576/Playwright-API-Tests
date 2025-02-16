import { test, expect } from "@playwright/test";
import {
  waitForServerReady,
  ensureResourceClean,
} from "../../fixtures/serverSetup";

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

test.beforeEach(async ({ request }, testInfo) => {
  console.log(`🔄 Running setup for test: ${testInfo.title}`);
  if (process.env.CI) {
    console.log("🔄 Running server readiness check in pipeline...");
    await waitForServerReady(request, `${API_BASE_URL}/nostro-accounts`);
  }

  await ensureResourceClean(
    request,
    `${API_BASE_URL}/nostro-accounts`,
    NOSTRO_ID,
    newNostroAccount
  );
});

test.describe("Nostro Account CRUD Operations", () => {
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
