import { expect } from "@playwright/test";

export function compareData(responseBody: any, referenceData: any): void {
  const normalize = (entry: any) => ({
    id: entry.id,
    counterpartyId: entry.counterpartyId,
    currency: entry.currency,
    nostroAccountId: entry.nostroAccountId,
    nostroDescription: entry.nostroDescription,
    managedById: entry.managedById,
  });

  const normalizedResponse = responseBody.map(normalize);
  const normalizedReference = referenceData.map(normalize);

  console.log(
    "🔍 Normalized API Response:",
    JSON.stringify(normalizedResponse, null, 2)
  );
  console.log(
    "🔍 Normalized Reference Data:",
    JSON.stringify(normalizedReference, null, 2)
  );

  expect(normalizedResponse).toEqual(normalizedReference);
}
