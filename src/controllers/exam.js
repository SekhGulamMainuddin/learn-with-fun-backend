const Exam = require("../models/exam");
const CourseCoverage = require("../models/course_coverage");
const Course = require("../models/course");

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

const getExamStats = async (req, res) => {
  try {
    const examsGiven = await Exam.find({
      learnerId: req.user,
    });
    let maxScore = 0;
    let marksScored = 0;
    const examCheatContentIdMap = new Map();
    examsGiven.forEach((e) => {
      examCheatContentIdMap.set(e.quizContentId, {
        quizTitle: "Quiz",
        courseName: "Course",
        courseId: "",
        cheatFlags: e.cheatFlags,
      });
      if (e.examStatus == "COMPLETED") {
        maxScore += e.examMaxScore;
        marksScored += e.examMarksScored;
      }
    });
    let overallPercentage = 0;
    if (maxScore != 0) {
      overallPercentage = (marksScored / maxScore) * 100;
    }

    const courseMap = new Map(
      (
        await Promise.all(
          Array.from(examsGiven.map((c) => Course.findById(c.courseId)))
        )
      ).map((o) => [o._id.toString(), o])
    );

    let quizAttendedForCourseMap = new Map();
    examsGiven.forEach((e) => {
      const course = courseMap.get(e.courseId);
      if (quizAttendedForCourseMap.has(e.courseId)) {
        let q = quizAttendedForCourseMap.get(e.courseId);
        q.totalQuizAttended++;
        if (totalNumberOfQuiz > 0) {
          q.quizAttendedPercentage =
            (q.totalQuizAttended.toFixed(2) / q.totalNumberOfQuiz.toFixed(2)) * 100.0;
        }
        quizAttendedForCourseMap.set(e.courseId, q);
      } else {
        let totalNumberOfQuiz = 0;
        course.contents.forEach(function (content, i) {
          if (content.quiz != null && content.quiz.length > 0) {
            totalNumberOfQuiz++;
          }
        });
        let totalQuizAttended = 0;
        if (e.examStatus == "COMPLETED") {
          totalQuizAttended++;
        }
        let quizAttendedPercentage = 0.0;
        if (totalNumberOfQuiz > 0) {
          quizAttendedPercentage =
            (totalQuizAttended.toFixed(2) / totalNumberOfQuiz.toFixed(2)) * 100.0;
        }
        quizAttendedForCourseMap.set(e.courseId, {
          totalNumberOfQuiz,
          totalQuizAttended,
          quizAttendedPercentage,
          courseName: course.courseName,
          courseDesc: course.courseDesc,
          courseThumbnail: course.courseThumbnail,
          courseId: course._id.toString(),
        });
      }
    });

    quizAttendedForCourseMap = Array.from(quizAttendedForCourseMap).map(
      ([key, value]) => value
    );

    res.status(200).json({
      overallPercentage,
      quizAttendedList: quizAttendedForCourseMap,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  attendExam,
  addCheatFlag,
  addScoreToAttendedQuestion,
  getExamStats,
};
