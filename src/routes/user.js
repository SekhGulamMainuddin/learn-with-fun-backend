const express = require("express");
const auth = require("../middlewares/auth");
const { createUser, sendMail, verifyMail, getUserDetails, updateActivity } = require("../controllers/user");
const router = express.Router();

router.post("/user", createUser);
router.get("/user/send-mail", sendMail);
router.post("/user/verify-mail", verifyMail);
router.get("/user", auth, getUserDetails);
router.post("/user/update-activity", auth, updateActivity);

module.exports = router;
