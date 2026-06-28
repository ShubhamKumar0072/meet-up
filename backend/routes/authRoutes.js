const express = require("express");
const{googleCallback, completeSetup, getCurrentUser, deleteAccount} = require("./../controllers/authController");
const passport = require("passport");
const router = express.Router();
const {authenticateUser} = require("../middleware/authMiddleware");

//Google login route
router.get(
    "/google",
    passport.authenticate("google",{
        scope: ["profile", "email"]
    })
);

//Get details of current User
router.get(
    "/me",
    authenticateUser,
    getCurrentUser
);

//google callback route
router.get(
    "/google/callback",
    passport.authenticate("google",{
        session: false,
        failureRedirect:"/"
    }),
    googleCallback
);

//Complete SetUp route
router.post("/setup",authenticateUser,completeSetup);

//Delete Account route
router.delete("/delete",authenticateUser,deleteAccount);


module.exports = router;