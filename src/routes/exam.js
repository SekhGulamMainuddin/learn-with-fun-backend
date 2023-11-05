const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const {
  attendExam,
  addCheatFlag,
  addScoreToAttendedQuestion,
} = require("../controllers/exam");

router.post("/attend-exam", auth, attendExam);
router.post("/add-cheat-flag", auth, addCheatFlag);
router.post("/add-score", auth, addScoreToAttendedQuestion);

module.exports = router;
