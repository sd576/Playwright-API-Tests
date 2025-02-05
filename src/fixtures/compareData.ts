import { expect } from "@playwright/test";

/**
 * Compares API response with reference data as is
 */
export function compareData(responseBody: any, referenceData: any): void {
  // Normalize both API response and reference data to ensure strict comparison
  const normalize = (entry: any) => ({
    counterpartyId: entry.counterpartyId || null,
    currency: entry.currency || null,
    id: entry.id ?? null,
    managedById: entry.managedById || null,
    nostroAccountId: entry.nostroAccountId || null,
    nostroDescription: entry.nostroDescription || null,
  });

  const normalizedResponse = responseBody.map(normalize);
  const normalizedReference = referenceData.map(normalize);

  // Perform a deep comparison ensuring no undefined values
  expect(normalizedResponse).toEqual(normalizedReference);
}
