import forge from "node-forge";

export function encryptPrivateKey(privateKey, pin) {
    // Generate random salt and IV
    const salt = forge.random.getBytesSync(16);
    const iv = forge.random.getBytesSync(16);

    // Derive AES key from PIN
    const key = forge.pkcs5.pbkdf2(
        pin,
        salt,
        100000,
        32
    );

    // Encrypt private key
    const cipher = forge.cipher.createCipher("AES-CBC", key);

    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(privateKey, "utf8"));
    cipher.finish();

    const encrypted = cipher.output.getBytes();

    // Store everything together
    return forge.util.encode64(salt + iv + encrypted);
}