import { encryptMessage, decryptMessage } from "./encryption.js";

const sample = "Test encryption!";
console.log("Original message:", sample);

const encryptedSample = encryptMessage(sample);
console.log("Encrypted sample:", encryptedSample);

const decryptedSample = decryptMessage(encryptedSample);
console.log("Decrypted sample:", decryptedSample);
