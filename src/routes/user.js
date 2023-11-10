const express = require("express");
const auth = require("../middlewares/auth");
const { createUser, sendMail, verifyMail, getUserDetails } = require("../controllers/user");
const router = express.Router();

router.post("/user", createUser);
router.get("/user/send-mail", sendMail);
router.post("/user/verify-mail", verifyMail);
router.get("/user", auth, getUserDetails);

module.exports = router;
