import fs from "node:fs";
import path from "node:path";
import { allMenuItems } from "./data";

const DATA_FILE = path.join(process.cwd(), ".data/availability.json");

type AvailabilityMap = Record<string, boolean>;

function readMap(): AvailabilityMap {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as AvailabilityMap;
  } catch {
    return {};
  }
}

function writeMap(map: AvailabilityMap) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(map, null, 2));
}

/** true = available (default); false = sold out */
export function isItemAvailable(itemId: string, seedAvailable = true): boolean {
  const map = readMap();
  if (itemId in map) return map[itemId] !== false;
  return seedAvailable;
}

export function getAvailabilityMap(): AvailabilityMap {
  const map = readMap();
  const out: AvailabilityMap = {};
  for (const item of allMenuItems()) {
    out[item.id] = isItemAvailable(item.id, item.isAvailable !== false);
  }
  return out;
}

export function setItemAvailable(itemId: string, available: boolean): AvailabilityMap {
  const map = readMap();
  map[itemId] = available;
  writeMap(map);
  return getAvailabilityMap();
}
