import { expect } from "@playwright/test";

/**
 * Compares API response with reference data as is
 */
export function compareData(responseBody: any, referenceData: any): void {
  // Normalize both API response and reference data for strict comparison
  const normalize = (entry: any) => ({
    counterpartyId: entry.counterpartyId || null,
    currency: entry.currency || null,
    id: entry.id ?? entry.compoundKey, // ✅ Map compoundKey -> id
    managedById: entry.managedById || null,
    nostroAccountId: entry.nostroAccountId ?? entry.nostroCode, // ✅ Map nostroCode -> nostroAccountId
    nostroDescription: entry.nostroDescription ?? entry.description, // ✅ Map description -> nostroDescription
  });

  const normalizedResponse = responseBody.map(normalize);
  const normalizedReference = referenceData.map(normalize);

  // Perform a deep comparison ensuring no undefined values
  expect(normalizedResponse).toEqual(normalizedReference);
}
