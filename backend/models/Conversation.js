const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            }
        ],

        encryptedAESKeys: {
            user0: {
                type: String,
                required: true,
            },

            user1: {
                type: String,
                required: true,
            }
        },

        lastMessage: {
            type: String,
            default: "",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Conversation", conversationSchema);