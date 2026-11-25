import * as Configstore from "configstore";
import { readSession, writeSession } from "./irnbru";

const prefs = new Configstore("firebase-tools-irnbru");
const accountKeys = new Set(["user", "tokens", "additionalAccounts", "session", "loginScopes", "tempLoginState"]);
let accounts: Record<string, unknown> | undefined;
function load(): Record<string, unknown> {
  return accounts ??= JSON.parse(readSession("default") ?? "{}") as Record<string, unknown>;
}
export function updateAccounts(changes: Record<string, unknown>) {
  const next = { ...load(), ...changes };
  for (const key of Object.keys(next)) if (next[key] === undefined) delete next[key];
  writeSession("default", Object.keys(next).length ? JSON.stringify(next) : null);
  accounts = next;
}
export const configstore = {
  get(key: string) { return accountKeys.has(key) ? load()[key] : prefs.get(key); },
  set(key: string, value: unknown) {
    if (accountKeys.has(key)) updateAccounts({ [key]: value });
    else prefs.set(key, value);
  },
  delete(key: string) {
    if (accountKeys.has(key)) updateAccounts({ [key]: undefined });
    else prefs.delete(key);
  },
  has(key: string) { return accountKeys.has(key) ? key in load() : prefs.has(key); },
};
