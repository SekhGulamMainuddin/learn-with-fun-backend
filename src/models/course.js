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
      quiz: [
        {
          question: {
            type: String,
            required: true,
          },
          options: [
            {
              type: String,
              required: true,
            },
          ],
          correctAns: {
            type: Number,
            required: true,
          },
        },
      ],
      notesPdfUrl: {
        type: String,
        defaultValue: null,
      },
    },
  ],
  tags: [String],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
