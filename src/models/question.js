const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  instructorId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  typeOfQuestion: {
    type: String,
    enum: ["TEXT", "IMAGE"],
    default: "TEXT",
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
  marks: {
    type: Number,
    required: true,
  },
  questionDesc: {
    type: String,
    default: null,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
