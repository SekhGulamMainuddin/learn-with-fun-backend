const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const courseCoverageSchema = mongoose.Schema({
  learnerId: {
    type: ObjectId,
    required: true,
  },
  courseId: {
    type: ObjectId,
    required: true,
  },
  contentCovered: [ObjectId],
  quizAttended: [
    {
      quizContentId: {
        type: ObjectId,
        required: true,
      },
      examId: {
        type: ObjectId,
        default: null,
      },
      lastAttendQuestionNumber: {
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
