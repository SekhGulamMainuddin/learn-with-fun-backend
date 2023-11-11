const mongoose = require("mongoose");

const courseCoverageSchema = mongoose.Schema({
  learnerId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  contentCovered: [String],
  quizAttended: [
    {
      quizContentId: {
        type: String,
        required: true,
      },
      examId: {
        type: String,
        default: null,
      },
      lastAttendedQuestionNumber: {
        type: Number,
        default: null
      },
      quizCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const CourseCoverage = mongoose.model("CourseCoverage", courseCoverageSchema);

module.exports = CourseCoverage;
