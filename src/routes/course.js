const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const {
  createCourse,
  addEnrollmentToCourse,
  addCourseContent,
  getAllEnrolledCourses,
  searchCoursesAndMentors,
  addQuiz,
  getRecommendedCourses,
  getCourse
} = require("../controllers/course");

router.post("/course", auth, createCourse);
router.post("/course/add-enrollment-to-course", auth, addEnrollmentToCourse);
router.post("/course/add-course-content", auth, addCourseContent);
router.get("/course/get-all-enrolled-courses", auth, getAllEnrolledCourses);
router.post("/course/search-courses-mentors", auth, searchCoursesAndMentors);
router.get("/course/get-recommended-courses", auth, getRecommendedCourses);
router.post("/course/add-quiz", addQuiz);
router.get("/course", auth, getCourse);

module.exports = router;
