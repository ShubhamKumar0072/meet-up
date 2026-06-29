const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const crypto = require("crypto");
const { generateToken } = require("../utils/jwt");

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const pinRegex = /^\d{6}$/;

const googleCallback = async (req, res) => {
    //console.log("Google callback is running");
    try {
        const googleId = req.user.id;
        const name = req.user.displayName;
        const email = req.user.emails[0].value;
        const profilePic = req.user.photos[0].value;

        let user = await User.findOne({ googleId });

        const tempUsername = `user_${crypto.randomBytes(4).toString("hex")}`;


        if (!user) {
            user = await User.create({
                username: tempUsername,
                googleId,
                name,
                email,
                profilePic
            });
        }

        const token = generateToken(user._id);
        //console.log(token);

        return res.redirect(
            `${process.env.VITE_FRONTEND_URL}/?token=${token}`
        )

    } catch (error) {
        console.log(error);
        return res.redirect(`${process.env.VITE_FRONTEND_URL}`);
    }
}

const completeSetup = async (req, res) => {
    try {
        const { username, publicKey, encryptedPrivateKey } = req.body;

        if (!username || username.trim().length === 0) {
            return res.status(400).json({
                message: "Username cannot be empty"
            });
        }

        // 🔐 Setup already done check
        if (req.user.isSetupComplete) {
            return res.status(400).json({
                message: "Setup already completed"
            });
        }

        // 🔐 Validate username format
        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message: "Invalid username format"
            });
        }

        // 🔐 Ensure publicKey exists
        if (!publicKey || !encryptedPrivateKey) {
            return res.status(400).json({
                message: "Missing security keys"
            });
        }

        // 🔐 Check username uniqueness
        const existingUser = await User.findOne({
            username,
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username already taken"
            });
        }

        // 🧱 Save user setup
        req.user.username = username;
        req.user.publicKey = publicKey;
        req.user.encryptedPrivateKey = encryptedPrivateKey;
        req.user.isSetupComplete = true;

        await req.user.save();

        return res.status(200).json({
            message: "Setup completed successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const getCurrentUser = (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            username: req.user.username,
            profilePic: req.user.profilePic,
            bio: req.user.bio,
            isSetupComplete: req.user.isSetupComplete,
            encryptedPrivateKey: req.user.encryptedPrivateKey,
            createdAt: req.user.createdAt,
        }
    });
}

const deleteAccount = async (req, res) => {
    try {

        const userId = req.user._id;
        const conversations = await Conversation.find({
            participants: userId
        });

        const conversationIds = conversations.map(
            conv => conv._id
        );

        await Message.deleteMany({
            conversation: {
                $in: conversationIds
            }
        });

        await Conversation.deleteMany({
            _id: {
                $in: conversationIds
            }
        });

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: "Account sussessfully deleted"
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    googleCallback,
    completeSetup,
    getCurrentUser,
    deleteAccount
};