const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const examSchema = mongoose.Schema({
  courseId: {
    type: ObjectId,
    required: true,
  },
  quizContentId: {
    type: ObjectId,
    required: true,
  },
  learnerId: {
    type: ObjectId,
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
  correctAnswerQuestionIds: [ObjectId],
  wrongAnswerQuestionIds: [ObjectId],
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
        required: true,
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
