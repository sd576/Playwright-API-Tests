import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/api",
  timeout: 60000,
  retries: 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000/api",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
    },
    trace: "on-first-retry",
  },
});
