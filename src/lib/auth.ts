const COOKIE_NAME = "eq_admin_token";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET env var is missing");

  // Encode to bytes, then extract a plain ArrayBuffer to satisfy TypeScript's
  // strict BufferSource typing (Uint8Array<ArrayBufferLike> vs ArrayBuffer).
  const encoded = new TextEncoder().encode(secret);
  const keyData = encoded.buffer.slice(
    encoded.byteOffset,
    encoded.byteOffset + encoded.byteLength
  ) as ArrayBuffer;

  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuf(hex: string): ArrayBuffer {
  const pairs = hex.match(/.{2}/g) ?? [];
  return new Uint8Array(pairs.map((b) => parseInt(b, 16))).buffer as ArrayBuffer;
}

function toArrayBuffer(data: Uint8Array): ArrayBuffer {
  return data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength
  ) as ArrayBuffer;
}

export async function signToken(username: string): Promise<string> {
  const payload = btoa(
    JSON.stringify({ username, exp: Date.now() + TOKEN_TTL_MS })
  );
  const key = await getKey();
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    toArrayBuffer(new TextEncoder().encode(payload))
  );
  return `${payload}.${bufToHex(sig)}`;
}

export async function verifyToken(
  token: string
): Promise<{ username: string } | null> {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sigHex = token.slice(dot + 1);

  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBuf(sigHex),
      toArrayBuffer(new TextEncoder().encode(payload))
    );
    if (!valid) return null;

    const data = JSON.parse(atob(payload));
    if (!data.exp || data.exp < Date.now()) return null;
    return { username: data.username };
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
