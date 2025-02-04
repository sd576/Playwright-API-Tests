import { test, expect } from "../../hooks/apiHooks";

const API_BASE_URL = "http://localhost:3000/api";
const COUNTERPARTY_ID = "CPTY001";

// Define initial test data
const newCounterparty = {
  id: "CPTY001",
  name: "Test Counterparty",
  city: "London",
  country: "United Kingdom",
  currency: "GBP",
  accountNumber: "11112222",
  swiftCode: "TESTGB00",
  contactPerson: "John Doe",
  email: "john.doe@example.com",
  phone: "+44 207000000",
};

// Ensure all tests run in order
test.describe.configure({ mode: "serial" });

test.describe("Counterparty API - CRUD Operations", () => {
  test("POST - Create a new counterparty", async ({ request }) => {
    console.log("🚀 Creating CPTY001...");

    const postResponse = await request.post(`${API_BASE_URL}/counterparties`, {
      data: newCounterparty,
    });

    console.log("POST Response Status:", postResponse.status());
    console.log("POST Response Body:", await postResponse.text());

    expect(postResponse.status()).toBe(201);

    // Wait to ensure DB commit
    console.log("⏳ Waiting 500ms...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  test("GET - Validate newly created counterparty", async ({ request }) => {
    console.log("🔍 Fetching CPTY001...");

    const getResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    console.log("GET Response Status:", getResponse.status());
    console.log("GET Response Body:", await getResponse.text());

    expect(getResponse.status()).toBe(200);
    const getResponseBody = await getResponse.json();
    expect(getResponseBody).toMatchObject(newCounterparty);
  });

  test("PUT - Update counterparty", async ({ request }) => {
    console.log("🚀 Updating CPTY001...");

    // Full updated object
    const updatedData = {
      id: "CPTY001",
      name: "Updated Counterparty",
      city: "London",
      country: "United Kingdom",
      currency: "GBP",
      accountNumber: "11112222",
      swiftCode: "TESTGB00",
      contactPerson: "John Doe",
      email: "john.doe@example.com",
      phone: "+44 20 7654 3210",
    };

    // Send full object in PUT request
    const putResponse = await request.put(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`,
      {
        data: updatedData,
      }
    );

    console.log("✅ PUT Response Status:", putResponse.status());
    console.log("✅ PUT Response Body:", await putResponse.text());

    expect(putResponse.status()).toBe(200);

    // Validate update by fetching the record again
    const getResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    const getResponseBody = await getResponse.json();

    console.log("🔍 GET After PUT Response Body:", getResponseBody);

    // Validate that the API response matches the full updated record
    expect(getResponseBody).toMatchObject(updatedData);
  });

  test("PATCH - Partially update counterparty", async ({ request }) => {
    console.log("🚀 Patching CPTY001...");

    const patchData = {
      city: "Birmingham",
      phone: "+441234567999",
    };

    const patchResponse = await request.patch(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`,
      {
        data: patchData,
      }
    );

    console.log("PATCH Response Status:", patchResponse.status());
    console.log("PATCH Response Body:", await patchResponse.text());

    expect(patchResponse.status()).toBe(200);

    // Validate PATCH
    const getResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    const getResponseBody = await getResponse.json();
    expect(getResponseBody).toMatchObject({
      ...newCounterparty,
      ...patchData,
      name: "Updated Counterparty",
    });
  });

  test("DELETE - Remove counterparty", async ({ request }) => {
    console.log("🚀 Deleting CPTY001...");

    const deleteResponse = await request.delete(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    console.log("DELETE Response Status:", deleteResponse.status());

    expect(deleteResponse.status()).toBe(204);

    // Verify deletion
    console.log("🔍 Verifying counterparty deletion...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const verifyResponse = await request.get(
      `${API_BASE_URL}/counterparties/${COUNTERPARTY_ID}`
    );
    console.log("GET After DELETE Response Status:", verifyResponse.status());
    console.log("GET After DELETE Response Body:", await verifyResponse.text());

    expect(verifyResponse.status()).toBe(404);
    expect(await verifyResponse.json()).toMatchObject({
      error: "Counterparty not found",
    });
  });
});
