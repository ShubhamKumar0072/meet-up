import forge from "node-forge";

/**
 * Encrypt a chat message using AES-GCM.
 *
 * @param {string} message Plain text message
 * @param {string} aesKey Base64 encoded AES-256 key
 * @returns {string} Base64 encoded (IV + Ciphertext)
 */
export async function encryptMessage(message, aesKey) {

    // Convert Base64 AES key to bytes
    const keyBytes = Uint8Array.from(
        atob(aesKey),
        c => c.charCodeAt(0)
    );

    // Import key
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        {
            name: "AES-GCM"
        },
        false,
        ["encrypt"]
    );

    // Random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv
        },
        cryptoKey,
        new TextEncoder().encode(message)
    );

    // Combine IV + ciphertext
    const combined = new Uint8Array(iv.length + encrypted.byteLength);

    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Return Base64
    return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a chat message.
 *
 * @param {string} encryptedMessage Base64 encoded (IV + Ciphertext)
 * @param {string} aesKey Base64 encoded AES-256 key
 * @returns {string} Plain text message
 */
export async function decryptMessage(encryptedMessage, aesKey) {

    // Convert Base64 AES key to bytes
    const keyBytes = Uint8Array.from(
        atob(aesKey),
        c => c.charCodeAt(0)
    );

    // Import key
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        {
            name: "AES-GCM"
        },
        false,
        ["decrypt"]
    );

    // Decode encrypted message
    const bytes = Uint8Array.from(
        atob(encryptedMessage),
        c => c.charCodeAt(0)
    );

    // Extract IV
    const iv = bytes.slice(0, 12);

    // Extract ciphertext
    const ciphertext = bytes.slice(12);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv
        },
        cryptoKey,
        ciphertext
    );

    return new TextDecoder().decode(decrypted);
}