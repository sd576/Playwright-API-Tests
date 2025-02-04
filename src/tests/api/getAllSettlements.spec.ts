import { test, expect } from "../../hooks/apiHooks";
import { compareData } from "../../fixtures/compareData";
import counterpartyData from "../../../reference-data/counterpartyData.json";
import nostroData from "../../../reference-data/nostroData.json";

test.describe.configure({ mode: "serial" });
