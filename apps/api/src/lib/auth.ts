import crypto from "node:crypto";

const HASH_ITERATIONS = 120_000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = "sha512";

function pbkdf2Async(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await pbkdf2Async(password, salt);

  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedHash = await pbkdf2Async(password, salt);
  const storedBuffer = Buffer.from(hash, "hex");

  if (storedBuffer.length !== derivedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedBuffer, derivedHash);
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}
