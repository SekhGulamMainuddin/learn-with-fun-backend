const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } =
  process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

const getOTP = async (req, res) => {
  const { countryCode, phoneNumber } = req.body;
  try {
    await client.verify.v2.services(TWILIO_SERVICE_SID).verifications.create({
      to: `+${countryCode}${phoneNumber}`,
      channel: "sms",
    });
    res.status(200).json({ body: "OTP sent successfully to your number" });
  } catch (error) {
    res
      .status(error?.status || 400)
      .json({ error: error?.message || "Something went wrong!" });
  }
};

const verifyOTP = async (req, res) => {
  const { countryCode, phoneNumber, otp } = req.body;
  try {
    await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });
    const phone = { countryCode: countryCode, phoneNumber: phoneNumber };
    const user = await User.findOne({ phone: phone });
    if (user != null) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      const response = {
        token: token,
        message: "OTP Verified.",
      };
      res.status(200).json(response);
    } else {
      res
        .status(201)
        .json({ message: "OTP Verified. Please add your Details" });
    }
  } catch (error) {
    res
      .status(error?.status || 400)
      .json({ error: error?.message || "Something went wrong!" });
  }
};

module.exports = { getOTP, verifyOTP };
