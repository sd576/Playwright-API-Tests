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

export async function ensureResourceClean(
  request: any,
  url: string,
  resourceId: string,
  postData: any
) {
  console.log(`♻️ Ensuring ${resourceId} does not exist before test...`);
  await request.delete(`${url}/${resourceId}`);

  console.log(`✅ Creating ${resourceId}...`);
  const postResponse = await request.post(`${url}`, { data: postData });

  if (postResponse.status() !== 201) {
    throw new Error(`❌ Failed to create ${resourceId}`);
  }
}
