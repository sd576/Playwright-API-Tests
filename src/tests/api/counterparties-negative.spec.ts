import { test, expect } from "../../hooks/apiHooks";

const API_BASE_URL = "http://localhost:3000/api";

test.describe.configure({ mode: "serial" });

test.describe("Negative CRUD API tests", () => {
  test("POST - Fail to create counterparty with missing required fields", async ({
    request,
  }) => {
    console.log("Attempting to create counterparty with missing fields");

    const incompleteCounterparty = { id: "CPTY999" };

    const response = await request.post(`${API_BASE_URL}/counterparties`, {
      data: incompleteCounterparty,
    });

    console.log("Response Status: ", response.status());
    expect(response.status()).toBe(400);
  });

  test("PUT - Fail to update non-existent counterparty", async ({
    request,
  }) => {
    console.log("Attempting to update a non-existent counterparty...");

    const response = await request.put(
      "http://localhost:3000/api/counterparties/CPTY_NON_EXISTENT",
      {
        data: {
          name: "Fake Counterparty",
          city: "Nowhere",
        },
      }
    );
    console.log("Response Status: ", response.status());

    expect(response.status()).toBe(404);

    const responseBody = await response.json().catch(() => "No JSON body");
    console.log("Response Body:", responseBody);
  });

  test("PATCH - Fail to send an invalid update request", async ({
    request,
  }) => {
    console.log(
      "Attempting to partially update a non-existent counterparty..."
    );

    const response = await request.patch(
      "http://localhost:3000/api/counterparties/CPTY_NON_EXISTENT",
      {
        data: {
          name: "Non existent person",
        },
      }
    );
    console.log("Response Status: ", response.status());

    expect(response.status()).toBe(404);

    const responseBody = await response.json().catch(() => "No JSON body");
    console.log("Response Body:", responseBody);
  });

  test("DELETE - A counterparty that does not exist", async ({ request }) => {
    console.log("Attempting to delete a Counterparty that does not exist");

    const deleteResponse = await request.delete(
      `http://localhost:3000/api/counterparties/NON_EXISTENT`
    );

    console.log("Response Status:", deleteResponse.status());
    console.log("Response Body:", await deleteResponse.text());

    expect([204, 404]).toContain(deleteResponse.status());
  });
});
