import { test as base, expect } from "@playwright/test";
import counterpartyData from "../../reference-data/counterpartyData.json";
import nostroData from "../../reference-data/nostroData.json";
import outrightTradeData from "../../reference-data/outrightTradeData.json";
import spotTradeData from "../../reference-data/spotTradeData.json";
import swapTradeData from "../../reference-data/swapTradeData.json";
/**
 * Extend Playwright's base test to include reference data in the test context.
 */
export const test = base.extend({
    testData: async ({}, use) => {
        console.log("Loading test data...");
        const referenceData = {
            counterpartyData,
            nostroData,
            outrightTradeData,
            spotTradeData,
            swapTradeData,
        };
        await use(referenceData); // Provide the reference data to the test context
    }
});
export { expect }; // Export Playwright's expect function for use in tests
