const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const {
  createCourse,
  addEnrollmentToCourse,
  addCourseContent,
  getAllEnrolledCourses,
  getAllCourses,
  addQuiz,
  getRecommendedCourses,
} = require("../controllers/course");

router.post("/course/create-course", auth, createCourse);
router.post("/course/add-enrollment-to-course", auth, addEnrollmentToCourse);
router.post("/course/add-course-content", auth, addCourseContent);
router.get("/course/get-all-enrolled-courses", auth, getAllEnrolledCourses);
router.post("/course/get-all-courses", auth, getAllCourses);
router.post("/course/get-recommended-courses", auth, getRecommendedCourses);
router.post("/course/add-quiz", addQuiz);

module.exports = router;
