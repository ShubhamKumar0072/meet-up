const express = require("express");
const{googleCallback, completeSetup, getCurrentUser} = require("./../controllers/authController");
const passport = require("passport");
const router = express.Router();
const {authenticateUser} = require("../middleware/authMiddleware");


router.get(
    "/google",
    passport.authenticate("google",{
        scope: ["profile", "email"]
    })
);

router.get(
    "/me",
    authenticateUser,
    getCurrentUser
);

router.get(
    "/google/callback",
    passport.authenticate("google",{
        session: false,
        failureRedirect:"/"
    }),
    googleCallback
);

router.post("/setup",authenticateUser,completeSetup);


module.exports = router;