import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = crypto.createHash('sha256').update(process.env.JWT_SECRET).digest();

export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(data) {
  const [ivHex, tagHex, encHex] = data.split(":");
  const decipher = crypto.createDecipheriv("aes-256-gcm", SECRET_KEY, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return decipher.update(Buffer.from(encHex, "hex"), "binary", "utf8") + decipher.final("utf8");
}
