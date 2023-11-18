const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const {
  attendExam,
  addCheatFlag,
  addScoreToAttendedQuestion,
  getExamStats
} = require("../controllers/exam");

router.post("/exam/attend-exam", auth, attendExam);
router.post("/exam/add-cheat-flag", auth, addCheatFlag);
router.post("/exam/add-score", auth, addScoreToAttendedQuestion);
router.get("/exam/exam-stats", auth, getExamStats);

module.exports = router;
