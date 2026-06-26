const User = require("../models/User");
const crypto = require("crypto");
const { generateToken } = require("../utils/jwt");

const googleCallback = async (req, res) => {
    //console.log("Google callback is running");
    try {
        const googleId = req.user.id;
        const name = req.user.displayName;
        const email = req.user.emails[0].value;
        const profilePic = req.user.photos[0].value;

        let user = await User.findOne({ googleId });

        const tempUsername = `temp_${crypto.randomBytes(4).toString("hex")}`;


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
        return res.redirect("http://localhost:5173/");
    }
}

const completeSetup = async (req, res) => {
    const { username, publicKey, encryptedPrivateKey } = req.body;

    if (req.user.isSetupComplete) {
        return res.status(400).json({
            message: "Setup already completed"
        });
    }


    const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
    if (existingUser) {
        return res.status(400).json({
            message: "Username already taken"
        });
    }

    req.user.username = username;
    req.user.publicKey = publicKey;
    req.user.encryptedPrivateKey = encryptedPrivateKey;
    req.user.isSetupComplete = true;

    await req.user.save();

    return res.status(200).json({
        message: "Setup completed successfully"
    });
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
        }
    });
}

module.exports = {
    googleCallback,
    completeSetup,
    getCurrentUser
};