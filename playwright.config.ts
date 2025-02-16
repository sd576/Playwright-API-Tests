import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests",
  timeout: 60000, // Global test timeout: 60 seconds
  retries: 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000/api",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
    },
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "CRUD tests",
      testMatch: ["**/CRUD/**"],
    },
    {
      name: "Negative tests",
      testMatch: ["**/Negative/**"],
    },
  ],
});
