import forge from "node-forge";

/**
 * Encrypt an AES key using an RSA public key.
 * (Useful later if you implement creating conversations from the frontend.)
 *
 * @param {string} aesKey Base64 encoded AES key
 * @param {string} publicKey PEM formatted RSA public key
 * @returns {string} Base64 encoded encrypted AES key
 */
export function encryptAESKey(aesKey, publicKey) {

    const key = forge.pki.publicKeyFromPem(publicKey);

    const encrypted = key.encrypt(
        aesKey,
        "RSA-OAEP",
        {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha256.create()
            }
        }
    );

    return forge.util.encode64(encrypted);
}

/**
 * Decrypt an AES key using the user's RSA private key.
 *
 * @param {string} encryptedAESKey Base64 encoded encrypted AES key
 * @param {string} privateKey PEM formatted RSA private key
 * @returns {string} Base64 encoded AES key
 */
export function decryptAESKey(encryptedAESKey, privateKey) {

    const key = forge.pki.privateKeyFromPem(privateKey);

    const decrypted = key.decrypt(
        forge.util.decode64(encryptedAESKey),
        "RSA-OAEP",
        {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha256.create()
            }
        }
    );

    return decrypted;
}