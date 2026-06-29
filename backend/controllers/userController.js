const User = require("../models/User");

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

const NAME_MIN = 2;
const NAME_MAX = 30;

const BIO_MAX = 150;

const editCurrentUser = async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.username !== undefined) {

            const username = req.body.username.trim().toLowerCase();

            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    message: "Username must be 3-20 characters and contain only letters, numbers and underscores."
                });
            }

            const existingUser = await User.findOne({
                username
            });

            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({
                    message: "Username already exists"
                });
            }

            user.username = username;
        }

        //Name
        if (req.body.name !== undefined) {
            const name = req.body.name.trim();

            if (name.length < NAME_MIN || name.length > NAME_MAX) {
                return res.status(400).json({
                    message: `Name must be between ${NAME_MIN} and ${NAME_MAX} characters`
                });
            }

            user.name = name;
        }

        if (req.body.bio !== undefined) {

            const bio = req.body.bio.trim();

            if (bio.length > BIO_MAX) {
                return res.status(400).json({
                    message: `Bio cannot exceed ${BIO_MAX} characters`
                });
            }

            user.bio = bio;
        }

        if (req.file) {
            user.profilePic = req.file.path;
        }

        await user.save();
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select(
            "name username bio profilePic createdAt isSetupComplete"
        );
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    editCurrentUser,
    getUserById
};
