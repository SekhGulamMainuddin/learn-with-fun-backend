const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const {
  attendExam,
  addCheatFlag,
  addScoreToAttendedQuestion,
} = require("../controllers/exam");

router.post("/exam/attend-exam", auth, attendExam);
router.post("/exam/add-cheat-flag", auth, addCheatFlag);
router.post("/exam/add-score", auth, addScoreToAttendedQuestion);

module.exports = router;
