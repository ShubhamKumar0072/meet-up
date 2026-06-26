const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        encryptedContent: {
            type: String,
            required: true,
        },

        messageType: {
            type: String,
            enum: ["text", "image", "file", "video", "audio"],
            default: "text",
        },

        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],

        status: {
            type: String,
            enum: ["sent", "delivered", "seen"],
            default: "sent",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", messageSchema);