const express = require("express");
const router = express.Router();

const {authenticateUser} = require("../middleware/authMiddleware");

const{createConversation,getConversation} = require("./../controllers/conversationController");

router.post("/create",authenticateUser,createConversation);
router.get("/",authenticateUser,getConversation);

module.exports = router;