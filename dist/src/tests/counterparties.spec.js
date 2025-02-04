import { test, expect } from "../fixtures/test.setup";
import { compareData } from "../fixtures/compareData";
test("GET /counterparties - Validate Counterparty Data", async ({ request, testData }) => {
    const response = await request.get("/api/counterparties");
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    compareData(responseBody, testData.counterpartyData);
});
