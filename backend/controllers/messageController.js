const Message = require("../models/Message");
const Conversation = require("./../models/Conversation");

const sendMessage = async (req, res) => {
    try {

        const senderId = req.user._id;
        const { conversationId, encryptedContent } = req.body;

        if (!conversationId || !encryptedContent) {
            return res.status(400).json({
                message: "conversationId and encryptedContent are required."
            });
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(400).json({
                message: "Conversation not found."
            });
        }

        // Verify sender belongs to this conversation
        if (
            !conversation.participants.some(
                id => id.toString() === senderId.toString()
            )
        ) {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        //Create Message
        const message = await Message.create({
            conversation: conversationId,
            sender: senderId,
            encryptedContent,
            status: "sent"
        }); 

        conversation.lastMessage = "Encrypted Message";
        await conversation.save();

        return res.status(201).json(message);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internal server error"
        });
    }
}

const getMessages = async (req, res) => {
    try {

        const { conversationId } = req.params;
        const { before } = req.query;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found."
            });
        }

        // Verify user belongs to this conversation
        if (
            !conversation.participants.some(
                id => id.toString() === userId.toString()
            )
        ) {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        const query = {
            conversation: conversationId
        };

        // Fetch messages older than the oldest loaded message
        if (before) {
            query._id = { $lt: before };
        }

        const messages = await Message.find(query)
            .populate("sender", "username name profilePic")
            .sort({ _id: -1 })   // newest first
            .limit(30);

        messages.reverse();      // oldest → newest

        return res.status(200).json(messages);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

module.exports = {
    sendMessage,
    getMessages
}