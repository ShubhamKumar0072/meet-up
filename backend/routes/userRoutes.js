const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const { editCurrentUser, getUserById} = require("./../controllers/userController");
const upload = require("./../middleware/upload");

router.patch(
    "/edit",
    authenticateUser,
    upload.single("profilePic"),
    editCurrentUser
);

router.get(
    "/:id",
    authenticateUser,
    getUserById
);

module.exports = router;