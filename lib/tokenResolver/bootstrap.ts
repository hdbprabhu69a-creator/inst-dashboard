import path from "path";
import { reload, isLoaded } from "./tokenResolver";

let initialized = false;

export function initializeTokenResolver(
    csvPath = path.join(process.cwd(), "data", "instruments.csv")
): void {
    if (initialized && isLoaded()) return;
    reload(csvPath);
    initialized = true;
}

export function ensureTokenResolver(): void {
    if (!initialized) {
        initializeTokenResolver();
    }
}
