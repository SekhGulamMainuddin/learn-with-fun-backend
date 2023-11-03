const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  instructorId: {
    type: String,
    required: true,
  },
  studentsEnrolled: {
    totalCount: {
      type: Number,
    },
    studentsId: [String],
  },
  price: {
    type: Number,
    required: true,
  },
  contents: [
    {
      video: {
        videoUrl: {
          type: String,
          required: true,
        },
        videoViewsIdList: [String],
        videoLikesIdList: [String],
        quiz: {
          type: String,
          defaultValue: null,
        },
        notesPdf: {
          type: String,
          defaultValue: null,
        },
      },
    },
  ],
  tags: [String],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
