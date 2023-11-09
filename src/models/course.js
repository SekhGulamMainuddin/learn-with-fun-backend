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
      quiz: [
        {
          question: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            default: null,
          },
          typeOfQuestion: {
            type: String,
            enum: ["TEXT", "IMAGE"],
            default: "TEXT",
          },
          options: [
            {
              option: {
                type: String,
                required: true,
              },
              optionType: {
                type: String,
                enum: ["TEXT", "IMAGE"],
                default: "TEXT",
              },
            },
          ],
          correctAns: {
            type: Number,
            required: true,
          },
          marks: {
            type: Number,
            required: true,
          },
          questionDesc: {
            type: String,
            default: null,
          },
        },
      ],
      notesPdfUrl: {
        type: String,
        defaultValue: null,
      },
      weekNumber: {
        type: Number,
        required: true,
      },
    },
  ],
  tags: [String],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
