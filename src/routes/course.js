const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const {createCourse, addEnrollmentToCourse, addCourseContent, getAllEnrolledCourses, getAllCourses} = require('../controllers/course');

router.post('/create-course', auth, createCourse);
router.post("/add-enrollment-to-course", auth, addEnrollmentToCourse);
router.post("/add-course-content", auth, addCourseContent);
router.get("/get-all-enrolled-courses", auth, getAllEnrolledCourses);
router.post("/get-all-courses", auth, getAllCourses);

module.exports = router;