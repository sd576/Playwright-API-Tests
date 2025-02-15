import {
  test as base,
  expect,
  request,
  APIRequestContext,
} from "@playwright/test";
import counterpartyData from "../../reference-data/counterpartyData.json";
import nostroData from "../../reference-data/nostroData.json";
import allTradeData from "../../reference-data/allTradeData.json";

/**
 * Extend Playwright's base test to include reference data in the test context.
 */
export const test = base.extend<{
  testData: Record<string, any>;
  request: APIRequestContext;
}>({
  testData: async ({}, use) => {
    console.log("Loading test data...");
    const referenceData = {
      counterpartyData,
      nostroData,
      allTradeData,
    };
    await use(referenceData); // Provide the reference data to the test context
  },
});

export { expect }; // Export Playwright's expect function for use in tests
