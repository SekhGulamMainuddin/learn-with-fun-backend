const Exam = require("../models/exam");
const CourseCoverage = require("../models/course_coverage");

const attendExam = async (req, res) => {
  try {
    const { courseId, quizContentId, examMaxScore } = req.body;
    let [exam, courseCoverage] = await Promise.all([
      new Exam({
        courseId,
        quizContentId,
        learnerId: req.user,
        examMaxScore,
        examMarksScored: 0,
        correctAnswerQuestionIds: [],
        wrongAnswerQuestionIds: [],
        cheatFlags: [],
        examStatus: "PENDING",
      }).save(),
      CourseCoverage.findOne({
        learnerId: req.user,
        courseId: courseId,
      }),
    ]);
    courseCoverage.quizAttended.push({
      quizContentId,
      examId: exam._id,
      lastAttendQuestionNumber: null,
      quizCompleted: false,
    });
    await courseCoverage.save();
    res.status(200).json({ message: "Can attend the exam", examId: exam._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addCheatFlag = async (req, res) => {
  try {
    const { examId, cheatFlag } = req.body;
    const exam = await Exam.findById(examId);
    cheatFlag.dateTime = new Date(cheatFlag.dateTime);
    exam.cheatFlags.push(cheatFlag);
    await exam.save();
    res.status(200).json({ message: "Cheat Flag Added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addScoreToAttendedQuestion = async (req, res) => {
  try {
    const {
      courseId,
      examId,
      isCorrect,
      isLast,
      maximumMarks,
      questionId,
      questionNumber,
    } = req.body;
    let [exam, courseCoverage] = await Promise.all([
      Exam.findById(examId),
      CourseCoverage.findOne({
        learnerId: req.user,
        courseId: courseId,
      }),
    ]);
    let quizAttended = courseCoverage.quizAttended.find(
      (o) => o.examId === examId
    );
    quizAttended.lastAttendedQuestionNumber = questionNumber;
    if (isCorrect) {
      exam.correctAnswerQuestionIds.push(questionId);
      exam.examMarksScored += maximumMarks;
    } else {
      exam.wrongAnswerQuestionIds.push(questionId);
    }
    if (isLast) {
      exam.examStatus = "COMPLETED";
      quizAttended.quizCompleted = true;
    }
    for (let i = 0; i < courseCoverage.quizAttended.length; i++) {
      if (courseCoverage.quizAttended[i].examId === examId) {
        courseCoverage.quizAttended[i] = quizAttended;
        break;
      }
    }
    await Promise.all([exam.save(), courseCoverage.save()]);
    const message = isLast ? "Exam Submitted Successfully" : "Answer Saved";
    res.status(200).json({ message: message });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { attendExam, addCheatFlag, addScoreToAttendedQuestion };
