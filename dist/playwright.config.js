import { defineConfig } from "@playwright/test";
export default defineConfig({
    testDir: "./src/tests",
    fullyParallel: true,
    retries: 1,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3000/api",
        extraHTTPHeaders: {
            "Content-Type": "application/json",
        },
        trace: "on-first-retry",
    },
});
