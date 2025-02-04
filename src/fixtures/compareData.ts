import { expect } from "@playwright/test";

export function compareData(responseBody: any, referenceData: any): void {
  if (JSON.stringify(responseBody) !== JSON.stringify(referenceData)) {
    console.error("Mismatch detected:");
    console.error("Received (Response Body):", JSON.stringify(responseBody, null, 2));
    console.error("Expected (Reference Data):", JSON.stringify(referenceData, null, 2));
  }

  // Perform a deep comparison
  expect(responseBody).toEqual(referenceData);
}
