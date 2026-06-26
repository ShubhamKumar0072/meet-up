const crypto= require("crypto");

//generate randon 256-bit AES key
function generateAESKey(){
    return crypto.randomBytes(32).toString("base64");
}

module.exports = {
    generateAESKey,
}