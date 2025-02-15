import { resolve } from "path";

export async function waitForServerReady(
  request: any,
  url: string,
  timeout = 10000
) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await request.get(url);
      if (response.status() === 200) {
        console.log("✅ Server is ready!");
        return true;
      }
    } catch (err) {
      console.log("Server not ready, retrying...");
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("❌ Server not ready after 10 seconds.");
}
