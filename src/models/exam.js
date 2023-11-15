const mongoose = require("mongoose");

const examSchema = mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  quizContentId: {
    type: String,
    required: true,
  },
  learnerId: {
    type: String,
    required: true,
  },
  examMaxScore: {
    type: Number,
    required: true,
  },
  examMarksScored: {
    type: Number,
    required: true,
  },
  correctAnswerQuestionIds: [String],
  wrongAnswerQuestionIds: [String],
  cheatFlags: [
    {
      flagType: {
        type: String,
        enum: [
          "CHEATING_DETECTED",
          "NO_FACE_DETECTED",
          "MULTIPLE_FACE_DETECTED",
          "EXAM_WINDOW_CHANGED_DURING_TEST",
        ],
        required: true,
        default: "CHEATING_DETECTED",
      },
      image: {
        type: String,
        default: "",
      },
      dateTime: {
        type: Date,
        required: true,
      },
    },
  ],
  examStatus: {
    type: String,
    enum: ["COMPLETED", "PENDING"],
    required: true,
    default: "PENDING",
  },
});

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
