const User = require("../models/User");

const editCurrentUser = async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.username) {
            const existingUser = await User.findOne({
                username: req.body.username
            });

            if (existingUser && existingUser._id.toString() !== userId) {
                console.log("username exist");
                return res.status(400).json({
                    message: "Username already exists"
                });
            }

            user.username = req.body.username.toLowerCase();
        }
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.bio) {
            user.bio = req.body.bio;
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

const getUserById = async(req,res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId).select(
            "name username bio profilePic createdAt"
        );
        if(!user){
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
