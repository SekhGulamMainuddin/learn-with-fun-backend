const mongoose = require("mongoose");

const emailVerificationSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  verificationStatus: {
    type: String,
    enum: ["VERIFIED", "PENDING"],
    required: true,
    default: "PENDING",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  }
});

const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema);

module.exports = EmailVerification;
