const Conversation = require("./../models/Conversation");
const { generateAESKey } = require("./../utils/aes");
const User = require("./../models/User");
const forge = require("node-forge");
const { encryptAESKey } = require("../utils/rsa");

const createConversation = async (req, res) => {
    try {

        const { receiverId } = req.body;
        const senderId = req.user._id;

        if (!receiverId) {
            return res.status(400).json({
                message: "Receiver ID is required."
            });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({
                message: "Receiver not found."
            });
        }

        //if conversation already exist
        const exist = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (exist) {
            return res.status(200).json(exist);
        }

        //AES Keys generation
        const aesKey = generateAESKey();

        if (!sender.isSetupComplete || !receiver.isSetupComplete) {
            return res.status(400).json({
                message: "Both users must complete setup."
            });
        }

        const encryptedAESKeys = {
            user0: encryptAESKey(aesKey, sender.publicKey),
            user1: encryptAESKey(aesKey, receiver.publicKey),
        };


        //create new conversation
        const conversation = await Conversation.create({
            participants: [senderId, receiverId],
            encryptedAESKeys
        });

        return res.status(201).json(conversation);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

const getConversation = async(req,res)=>{
    try{

        const userId = req.user._id;
        const conversations = await Conversation.find({
            participants: userId
        }).populate(
            "participants",
            "username name profilePic"
        );

        return res.status(200).json(conversations);

    }catch(error){
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