const forge = require("node-forge");

/**
 * Encrypt AES key using RSA public key.
 *
 * @param {string} aesKey
 * @param {string} publicKey
 * @returns {string}
 */
function encryptAESKey(aesKey, publicKey) {

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

module.exports = {
    encryptAESKey,
};