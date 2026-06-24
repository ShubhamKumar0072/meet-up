const User = require("../models/User");
const crypto = require("crypto");
const { generateToken } = require("../utils/jwt");

const registerUser = async (req, res) => {

    const { username, name, email, password } = req.body;

    //if any fields are empty
    if (!username || !name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    //if username or email alredy exist
    const existingUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (existingUser) {
        return res.status(400).json({
            message: "Username or email already exist"
        });
    }

    const user = await User.create({
        username,
        name,
        email,
        password
    });


    res.json({
        username, name, email, password
    });

};


const googleCallback = async (req, res) => {
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

    res.json({
        token,
        user: {
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio,
            isSetupComplete: user.isSetupComplete
        }
    });

}

const completeSetup = async (req, res) => {
    const { username, publicKey, encryptedPrivateKey } = req.body;
    
    if (req.user.isSetupComplete) {
        return res.status(400).json({
            message: "Setup already completed"
        });
    }


    const existingUser = await User.findOne({ username, _id: { $ne: req._id } });
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

module.exports = {
    registerUser,
    googleCallback,
    completeSetup
};