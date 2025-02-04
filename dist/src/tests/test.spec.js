import { test, expect } from "../fixtures/test.setup";
test.describe.configure({ mode: "serial" });
const newCounterparty = {
    id: "CPTY001",
    name: "Global Trading 01 Ltd",
    city: "London",
    country: "UK",
    currency: "GBP",
    accountNumber: "12345678",
    swiftCode: "GB123456",
    contactPerson: "John Doe",
    phone: "+441234567890",
    email: "contact@globaltrading.com",
};
test.describe("Counterparty API - CRUD Operations", () => {
    test("POST /counterparties - Create a new counterparty", async ({ request }) => {
        const response = await request.post("/counterparties", {
            data: newCounterparty,
        });
        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        expect(responseBody).toEqual(newCounterparty);
    });
    test("PUT /counterparties/{id} - Update an existing counterparty", async ({ request }) => {
        const updatedCounterparty = { ...newCounterparty, city: "Glasgow" };
        const response = await request.put(`/counterparties/${updatedCounterparty.id}`, {
            data: updatedCounterparty,
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual(updatedCounterparty);
    });
    test("PATCH /counterparties/{id} - Partially update a counterparty", async ({ request }) => {
        const partialUpdate = { city: "Partially Updated City", phone: "+441234567900" };
        const response = await request.patch(`/counterparties/CPTY001`, {
            data: partialUpdate,
        });
        expect(response.status()).toBe(200);
        // Verify the update
        const getResponse = await request.get(`/counterparties/CPTY001`);
        const retrievedCounterparty = await getResponse.json();
        expect(retrievedCounterparty.city).toBe(partialUpdate.city);
        expect(retrievedCounterparty.phone).toBe(partialUpdate.phone);
    });
    test("DELETE /counterparties/{id} - Delete a counterparty", async ({ request }) => {
        const response = await request.delete(`/counterparties/CPTY001`);
        expect(response.status()).toBe(204);
        // Verify deletion
        const getResponse = await request.get(`/counterparties/CPTY001`);
        expect(getResponse.status()).toBe(404);
    });
});
