const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        require: true,
    },

    googleId: {
        type: String,
        required: true,
        unique: true
    },


    //from google
    name: {
        type: String,
        required: true,
        trim: true
    },

    //from google
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },


    //from google by default
    profilePic: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: "Hey there I am on MeetUp :)"
    },

    publicKey: {
        type: String,
        default: null
    },

    encryptedPrivateKey: {
        type: String,
        default: null
    },

    isSetupComplete: {
        type: Boolean,
        default: false
    },


    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline"
    }
},{
    timestamps: true
});

module.exports = mongoose.model("User",userSchema);