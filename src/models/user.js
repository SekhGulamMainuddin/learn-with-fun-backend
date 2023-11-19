const mongoose = require("mongoose");
const isEmailValid = require("../utils/utils");

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    type: String,
    validate: {
      validator: (value) => {
        return isEmailValid(value);
      },
      message: "Enter a valid email",
    },
  },
  phone: {
    countryCode: {
      type: Number,
      required: true,
      unique: false,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
  },
  userType: {
    type: String,
    enum: ["LEARNER", "TEACHER"],
    default: "LEARNER",
  },
  profilePicture: {
    type: String,
    default: null,
  },
  courses: [String],
  courseTags: [String],
  activity: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  videoActivity: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  quizActivity: {
    type: Map,
    of: Number,
    default: new Map(),
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
