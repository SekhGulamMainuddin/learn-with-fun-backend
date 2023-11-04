const User = require("../models/user");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { name, email, countryCode, phoneNumber, userType, profilePicture } =
      req.body;
    const phone = {
      countryCode: countryCode,
      phoneNumber: phoneNumber,
    };
    let user = new User({
      name,
      email,
      phone,
      userType,
      profilePicture,
      courses: [],
    });
    user = await user.save();
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    return res.status(201).json({
      token: token,
      user: user,
      message: "OTP Verified.",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createUser };
