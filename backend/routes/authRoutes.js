const express = require("express");
const{registerUser, googleCallback, completeSetup} = require("./../controllers/authController");
const passport = require("passport");
const router = express.Router();
const {authenticateUser} = require("../middleware/authMiddleware");

router.post("/register",registerUser);

router.get(
    "/google",
    passport.authenticate("google",{
        scope: ["profile", "email"]
    })
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