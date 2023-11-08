const express = require("express");
const { createUser, sendMail, verifyMail } = require("../controllers/user");
const router = express.Router();

router.post("/create-user", createUser);
router.get("/send-mail", sendMail);
router.post("/verify-mail", verifyMail);

module.exports = router;
