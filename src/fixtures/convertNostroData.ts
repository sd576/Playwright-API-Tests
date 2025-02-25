import * as fs from "fs";
import * as path from "path";

// Define interfaces for strong typing
interface NostroEntry {
  compoundKey: string;
  counterpartyId: string;
  currency: string;
  nostroCode: string;
  managedById: string;
  description: string;
}

interface ConvertedNostroEntry {
  id: string;
  counterpartyId: string;
  currency: string;
  nostroAccountId: string;
  nostroDescription: string;
  managedById: string;
}

// Define the file paths
const originalFilePath =
  "/Volumes/Stuarts Documents/API_Playwright/fx_trader_api/reference-data/nostroData.json";
const convertedFilePath =
  "/Volumes/Stuarts Documents/API_Playwright/fx_trader_api/reference-data/convertedNostroData.json";

function convertNostroData(): void {
  try {
    const rawData = fs.readFileSync(originalFilePath, "utf8");
    const nostroData: NostroEntry[] = JSON.parse(rawData);

    const updatedData: ConvertedNostroEntry[] = nostroData.map(
      (entry: NostroEntry) => ({
        id: entry.compoundKey,
        counterpartyId: entry.counterpartyId,
        currency: entry.currency,
        nostroAccountId: entry.nostroCode,
        nostroDescription: entry.description,
        managedById: entry.managedById,
      })
    );

    fs.writeFileSync(
      convertedFilePath,
      JSON.stringify(updatedData, null, 2),
      "utf8"
    );

    console.log(`✅ Converted data saved at: ${convertedFilePath}`);
  } catch (error) {
    console.error("❌ Error converting nostroData.json:", error);
  }
}

convertNostroData();
