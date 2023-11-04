const mongoose = require("mongoose");

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
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
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
    enum: ["STUDENT", "INSTRUCTOR"],
    default: "STUDENT",
  },
  profilePicture: {
    type: String,
    default: null,
  },
  courses: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
