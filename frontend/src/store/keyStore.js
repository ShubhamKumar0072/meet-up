// This file acts as in-memory storage for decrypted private key
// It will reset automatically on page refresh (by design)

let privateKey = null;


//Save decrypted private key in memory

export function setPrivateKey(key) {
    privateKey = key;
}


 // Get decrypted private key from memory

export function getPrivateKey() {
    return privateKey;
}


//Remove private key from memory (logout / PIN reset)

export function clearPrivateKey() {
    privateKey = null;
}


//Check if user has unlocked key in current session

export function hasPrivateKey() {
    return privateKey !== null;
}