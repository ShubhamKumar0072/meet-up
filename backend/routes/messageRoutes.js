const express = require("express");
const router = express.Router();

const {authenticateUser} = require("./../middleware/authMiddleware");

const{sendMessage,getMessages} = require("./../controllers/messageController");

router.post("/send",authenticateUser,sendMessage);
router.get("/:conversationId",authenticateUser,getMessages);

module.exports = router;