const jwt = require("jsonwebtoken");
const User = require("../models/User");


const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();
        
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    };

};

module.exports = {
    authenticateUser
};