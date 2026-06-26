import forge from "node-forge";

/* ============================================================
   Generate RSA Key Pair
   Returns:
   {
      publicKey: PEM String,
      privateKey: PEM String
   }
============================================================ */
export function generateRSAKeys() {
    const keyPair = forge.pki.rsa.generateKeyPair({
        bits: 2048,
        e: 0x10001,
    });

    return {
        publicKey: forge.pki.publicKeyToPem(keyPair.publicKey),
        privateKey: forge.pki.privateKeyToPem(keyPair.privateKey),
    };
}

/* ============================================================
   Encrypt any string using user's PIN
   Returns a Base64 string containing:
   salt + iv + encryptedData
============================================================ */
export async function encryptWithPin(data, pin) {

    // Generate random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive AES key from PIN
    const aesKey = await deriveKeyFromPin(pin, salt);

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        aesKey,
        new TextEncoder().encode(data)
    );

    // Combine salt + iv + encrypted bytes
    const combined = new Uint8Array(
        salt.length + iv.length + encrypted.byteLength
    );

    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    // Convert to Base64
    return btoa(String.fromCharCode(...combined));
}

/* ============================================================
   Decrypt encrypted data using PIN
============================================================ */
export async function decryptWithPin(encryptedData, pin) {

    // Decode Base64
    const bytes = Uint8Array.from(
        atob(encryptedData),
        c => c.charCodeAt(0)
    );

    // Extract salt
    const salt = bytes.slice(0, 16);

    // Extract IV
    const iv = bytes.slice(16, 28);

    // Extract encrypted data
    const ciphertext = bytes.slice(28);

    // Derive AES key
    const aesKey = await deriveKeyFromPin(pin, salt);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
        },
        aesKey,
        ciphertext
    );

    // Convert back to string
    return new TextDecoder().decode(decrypted);
}

/* ============================================================
   PRIVATE FUNCTION
   Derive AES-256 key from PIN using PBKDF2
============================================================ */
async function deriveKeyFromPin(pin, salt) {

    // Convert PIN to CryptoKey
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(pin),
        {
            name: "PBKDF2",
        },
        false,
        ["deriveKey"]
    );

    // Derive AES key
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        {
            name: "AES-GCM",
            length: 256,
        },
        false,
        ["encrypt", "decrypt"]
    );
}