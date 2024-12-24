import crypto from "crypto";
import { config } from "dotenv";

// Load environment variables
config();

// Secret key (must be 32 bytes for AES-256)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

// Function to encrypt a message
export const encryptMessage = (text) => {
  try {
    console.log("Encrypting message:", text);

    if (Buffer.from(ENCRYPTION_KEY, "hex").length !== 32) {
      throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex characters).");
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    console.log("Generated IV:", iv.toString("hex"));

    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY, "hex"),
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    console.log("Encrypted data:", encrypted);

    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Error during encryption:", error.message);
    throw new Error("Encryption failed");
  }
};

// Function to decrypt a message
export const decryptMessage = (encryptedText) => {
  try {
    console.log("Decrypting message:", encryptedText);

    if (Buffer.from(ENCRYPTION_KEY, "hex").length !== 32) {
      throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex characters).");
    }

    const [iv, encrypted] = encryptedText.split(":");
    console.log("IV:", iv, "Encrypted Text:", encrypted);

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY, "hex"),
      Buffer.from(iv, "hex")
    );

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    console.log("Decrypted message:", decrypted);

    return decrypted;
  } catch (error) {
    console.error("Error during decryption:", error.message);
    throw new Error("Decryption failed");
  }
};
