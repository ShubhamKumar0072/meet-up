const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const { editCurrentUser} = require("./../controllers/userController");


router.patch("/edit",authenticateUser,editCurrentUser);

module.exports = router;