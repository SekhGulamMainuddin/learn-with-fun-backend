const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseDesc: {
    type: String,
    required: true,
  },
  courseThumbnail: {
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
      title: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      thumbnail: {
        type: String,
        required: true,
      },
      viewsIdList: [String],
      likesIdList: [String],
      quiz: [String],
      notesPdfUrl: {
        type: String,
        defaultValue: null,
      },
    },
  ],
  tags: [String],
  weekNumber: {
    type: Number,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
