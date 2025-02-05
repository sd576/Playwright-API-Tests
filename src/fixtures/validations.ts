/** Regex pattern for valid Counterparty ID's */
const validCounterpartyPattern = /^[A-Z0-9]{8,12}$/;

/**
 * Validates whether a given ID matches the counterparty ID pattern.
 * @param {string | null} id - the ID to validate.
 * @returns {boolean} True if valid, false otherwise.
 */

export function isValidCounterpartyId(id: string | null): boolean {
  if (id === null) return false;
  return validCounterpartyPattern.test(id);
}
