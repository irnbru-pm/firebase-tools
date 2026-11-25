import { auth } from "google-auth-library";
import type { Account } from "./types/auth";

// Project processes can supply their own ADC. Never export an IrnBru session to disk.
export async function getCredentialPathAsync(_account: Account): Promise<string | undefined> { return undefined; }
export function clearCredentials(_account: Account): void {}

export async function hasDefaultCredentials(): Promise<boolean> {
  try {
    await auth.getApplicationDefault();
    return true;
  } catch (err: any) {
    return false;
  }
}
