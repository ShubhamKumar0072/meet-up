const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const { editCurrentUser} = require("./../controllers/userController");
const upload = require("./../middleware/upload");

router.patch(
    "/edit",
    authenticateUser,
    upload.single("profilePic"),
    editCurrentUser
);

module.exports = router;