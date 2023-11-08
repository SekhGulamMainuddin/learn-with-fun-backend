const express = require("express");
const auth = require("../middlewares/auth");
const { createUser, sendMail, verifyMail, getUserDetails } = require("../controllers/user");
const router = express.Router();

router.post("/user", createUser);
router.get("/user", auth, getUserDetails);
router.get("/send-mail", sendMail);
router.post("/verify-mail", verifyMail);

module.exports = router;
