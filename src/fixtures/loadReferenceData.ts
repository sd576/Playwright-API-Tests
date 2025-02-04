import { fileURLToPath } from "url";
import * as path from "path";
import * as fs from "fs";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads reference JSON data from the `reference-data` directory.
 * @param fileName - Name of the JSON file to load (e.g., "counterpartyData.json").
 * @returns Parsed JSON data as a JavaScript object or array, or undefined if an error occurs.
 */
export function loadReferenceData(fileName: string): object | undefined {
  try {
    const filePath = path.resolve(__dirname, "../../reference-data", fileName);
    console.log(`Loading reference data from: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Reference data file not found: ${filePath}`);
    }

    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error loading reference data from ${fileName}:`,
        error.message
      );
    } else {
      console.error(`Unknown error occurred:`, error);
    }
    return undefined;
  }
}
