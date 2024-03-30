const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const EmailVerification = require("../models/email_verification");
const CourseCoverage = require("../models/course_coverage");
const Course = require("../models/course");

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
    let emailVerification = await EmailVerification.findOne({ email });
    emailVerification.verficationStatus = "VERIFIED";
    emailVerification.userId = user._id;
    await emailVerification.save();
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    return res.status(201).json({
      token: token,
      user: user,
      message: "User Created",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendMail = async (req, res) => {
  try {
    const email = req.query.email;
    const alreadyPresentEmail = await EmailVerification.findOne({
      email: email,
    });
    if (alreadyPresentEmail != null && alreadyPresentEmail.userId.length > 0) {
      return res
        .status(403)
        .json({ message: "Email already taken by other user" });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const response = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your LearnWithFun Account",
      text: `Your Verification Code is ${verificationCode}`,
    });
    if (response.accepted.includes(email)) {
      if (alreadyPresentEmail != null) {
        alreadyPresentEmail.verificationCode = verificationCode;
        await alreadyPresentEmail.save();
      } else {
        const emailVerification = new EmailVerification({
          email,
          verificationCode,
          verficationStatus: "PENDING",
        });
        await emailVerification.save();
      }
      res.status(200).json({ message: `Email sent to ${email}` });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyMail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    let emailVerification = await EmailVerification.findOne({
      email: email,
    });
    if (emailVerification == null) {
      res.status(404).json({
        message: "Email not found for verification",
      });
    } else {
      if (emailVerification.verificationCode == verificationCode) {
        emailVerification.verificationStatus = "VERIFIED";
        await emailVerification.save();
        res.status(200).json({
          message: "Email verification successful",
        });
      } else {
        res.status(403).json({
          message: "Wrong Verification Code. Email not verified",
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const [user, course_coverage_list, courses] = await Promise.all([
      User.findById(req.user),
      CourseCoverage.find({ learnerId: req.user }),
      Course.find({ "studentsEnrolled.studentsId": req.user }),
    ]);
    const enrolled_courses = [];
    const course_coverage = new Map(
      course_coverage_list.map((o) => [o.courseId, o.contentCovered.length])
    );
    const instructors = new Map(
      (
        await Promise.all(
          Array.from(courses.map((c) => User.findById(c.instructorId)))
        )
      ).map((o) => o!=null ? [o._id.toString(), o.name] : [])
    );
    for (let course of courses) {
      enrolled_courses.push({
        courseName: course.courseName,
        courseId: course._id,
        courseThumbnail: course.courseThumbnail,
        instructorName: instructors.get(course.instructorId),
        courseCoverage:
          parseInt(course_coverage.get(course._id.toString())) || 0,
        courseLength: course.contents.length,
      });
    }
    res.status(200).json({ user, enrolled_courses });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    let { type, date, time } = req.body;
    const user = await User.findById(req.user);
    updateDate(user, date, time, type);
    await user.save();
    res.status(200).json({ message: "Activity saved successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

function updateDate(user, date, time, type) {
  if (type === "Video") {
    if (user.videoActivity.has(date)) {
      let previousActivity = user.videoActivity.get(date);
      previousActivity += time;
      user.videoActivity.set(date, previousActivity);
    } else {
      user.videoActivity.set(date, time);
    }
  } else if (type === "Quiz") {
    if (user.quizActivity.has(date)) {
      let previousActivity = user.quizActivity.get(date);
      previousActivity += time;
      user.quizActivity.set(date, previousActivity);
    } else {
      user.quizActivity.set(date, time);
    }
  } else {
    if (user.activity.has(date)) {
      let previousActivity = user.activity.get(date);
      previousActivity += time;
      user.activity.set(date, previousActivity);
    } else {
      user.activity.set(date, time);
    }
  }
}

module.exports = {
  createUser,
  sendMail,
  verifyMail,
  getUserDetails,
  updateActivity,
};
