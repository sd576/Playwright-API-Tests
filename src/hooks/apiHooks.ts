import { test as base, expect, APIRequestContext } from "@playwright/test";

export const test = base.extend<{ requestContext: APIRequestContext }>({
  requestContext: async ({ request }, use) => {
    await use(request);
  },
});

export { expect };
