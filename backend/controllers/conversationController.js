const Conversation = require("./../models/Conversation");
const { generateAESKey } = require("./../utils/aes");
const User = require("./../models/User");
const forge = require("node-forge");
const { encryptAESKey } = require("../utils/rsa");

const createConversation = async (req, res) => {
    try {
        const { username } = req.body;
        const senderId = req.user._id;

        if (!username) {
            return res.status(400).json({
                message: "username is required."
            });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findOne({ username });

        if (!receiver) {
            return res.status(404).json({
                message: "Receiver not found."
            });
        }

        const receiverId = receiver._id;

        // check existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // if exists → just return populated
        if (conversation) {
            conversation = await Conversation.findById(conversation._id)
                .populate("participants", "username name profilePic bio");

            return res.status(200).json(conversation);
        }

        // check setup
        if (!sender.isSetupComplete || !receiver.isSetupComplete) {
            return res.status(400).json({
                message: "Both users must complete setup."
            });
        }

        // generate AES key
        const aesKey = generateAESKey();

        const encryptedAESKeys = {
            user0: encryptAESKey(aesKey, sender.publicKey),
            user1: encryptAESKey(aesKey, receiver.publicKey),
        };

        // create conversation
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
            encryptedAESKeys
        });

        // populate AFTER creation
        conversation = await Conversation.findById(conversation._id)
            .populate("participants", "username name profilePic bio");


        //socket code
        const io = req.app.get("io");
        const userSocketMap = req.app.get("userSocketMap");
        const receiverSocketId = userSocketMap.get(receiverId.toString());
        const senderSocketId = userSocketMap.get(senderId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newConversation", {
                conversation,
                createdByMe: false
            });
        }

        if (senderSocketId) {  
            io.to(senderSocketId).emit("newConversation", {
                conversation,
                createdByMe: true
            });
        }


        return res.status(201).json(conversation);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getConversation = async (req, res) => {
    try {

        const userId = req.user._id;
        const conversations = await Conversation.find({
            participants: userId
        }).populate(
            "participants",
            "username name profilePic bio"
        );

        return res.status(200).json(conversations);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    createConversation,
    getConversation,
}