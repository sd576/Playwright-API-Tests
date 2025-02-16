export async function waitForServerReady(
  request: any,
  url: any,
  maxAttempts = 60,
  interval = 1000
) {
  console.log(`🔄 Checking server readiness at ${url}`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await request.get(url);
      if (response.status() === 200) {
        console.log(`✅ Server is ready at ${url} (Attempt ${attempt})`);
        return;
      } else {
        console.log(
          `❗ Attempt ${attempt}: Received status ${response.status()}`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(`⚠️ Attempt ${attempt}: Error occurred - ${error.message}`);
      } else {
        console.log(`⚠️ Attempt ${attempt}: Unknown error occurred`);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(
    `❌ Server not ready after ${maxAttempts} attempts (${
      (maxAttempts * interval) / 1000
    } seconds).`
  );
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
