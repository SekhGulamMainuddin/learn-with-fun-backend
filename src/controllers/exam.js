const Exam = require("../models/exam");

const attendExam = async (req, res) => {
  try {
    const { courseId, quizId, examMaxScore } = req.body;
    let exam = new Exam({
      courseId,
      quizId,
      studentId: req.user,
      examMaxScore,
      examMarksScored: 0,
      correctAnswerQuestionIds: [],
      wrongAnswerQuestionIds: [],
      cheatFlags: [],
      examStatus: "PENDING",
    });
    exam = await exam.save();
    res.status(200).json({ message: "Can attend the exam", examId: exam._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addCheatFlag = async (req, res) => {
  try {
    const { examId, cheatFlag } = req.body;
    const exam = await Exam.findById(examId);
    exam.cheatFlags.push(cheatFlag);
    await exam.save();
    res.status(200).json({ message: "Cheat Flag Added" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addScoreToAttendedQuestion = async (req, res) => {
  try {
    const { examId, questionId, maximumMarks, isCorrect, isLast } = req.body;
    let exam = await Exam.findById(examId);
    if (isCorrect) {
      exam.correctAnswerQuestionIds.push(questionId);
      exam.examMarksScored += maximumMarks;
    } else {
      exam.wrongAnswerQuestionIds.push(questionId);
    }
    if (isLast) {
      exam.examStatus = "COMPLETED";
    }
    await exam.save();
    const message = isLast ? "Exam Submitted Successfully" : "Answer Saved";
    res.status(200).json({ message: message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { attendExam, addCheatFlag, addScoreToAttendedQuestion };
