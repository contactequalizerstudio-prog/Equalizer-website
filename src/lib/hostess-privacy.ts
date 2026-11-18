import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

const SEAL_PREFIX = "enc:v1:";
const SALT = "eq-hostess-private-v1";

export const PRIVATE_HOSTESS_FIELDS = ["phone", "address", "comment"] as const;
export type PrivateHostessField = (typeof PRIVATE_HOSTESS_FIELDS)[number];

export type PrivateHostessFields = Partial<Record<PrivateHostessField, string>>;

let keyCache: { secret: string; key: Buffer } | null = null;

function encryptionKey(): Buffer {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is required to store private hostess fields");
  }
  if (keyCache?.secret === secret) return keyCache.key;
  const key = scryptSync(secret, SALT, 32);
  keyCache = { secret, key };
  return key;
}

/** Encrypt a non-empty admin-only value. Empty values stay empty and do not need a secret. */
export function sealField(value: string | undefined): string {
  if (!value) return "";
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return (
    SEAL_PREFIX + Buffer.concat([iv, tag, ciphertext]).toString("base64url")
  );
}

/**
 * Decrypt a sealed value. Legacy plaintext is returned unchanged so existing
 * records can still be read before they are rewritten. A bad ciphertext
 * becomes an empty string instead of throwing on the public page.
 */
export function openField(value: string | undefined): string {
  if (!value) return "";
  if (!value.startsWith(SEAL_PREFIX)) return value;
  try {
    const buf = Buffer.from(value.slice(SEAL_PREFIX.length), "base64url");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ciphertext = buf.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
      "utf8"
    );
  } catch {
    return "";
  }
}

export function isLegacyPrivateValue(value: string | undefined): boolean {
  return typeof value === "string" && value.length > 0 && !value.startsWith(SEAL_PREFIX);
}

export function hasLegacyPrivateFields(item: PrivateHostessFields): boolean {
  return PRIVATE_HOSTESS_FIELDS.some((key) => isLegacyPrivateValue(item[key]));
}

export function sealHostessRecord<T extends PrivateHostessFields>(item: T): T {
  const next = { ...item };
  for (const key of PRIVATE_HOSTESS_FIELDS) {
    if (next[key]) next[key] = sealField(next[key]);
  }
  return next;
}

export function openHostessRecord<T extends PrivateHostessFields>(item: T): T {
  const next = { ...item };
  for (const key of PRIVATE_HOSTESS_FIELDS) {
    if (next[key] !== undefined) next[key] = openField(next[key]);
  }
  return next;
}

/** Drop admin-only fields before they are serialized to the public site. */
export function stripPrivateHostessFields<T extends PrivateHostessFields>(
  item: T
): Omit<T, PrivateHostessField> {
  const next = { ...item };
  for (const key of PRIVATE_HOSTESS_FIELDS) {
    delete next[key];
  }
  return next;
}
