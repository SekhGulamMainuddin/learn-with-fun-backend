const express = require('express');
const router = express.Router();
const {createCourse, addEnrollmentToCourse, addCourseContent, getAllEnrolledCourses, getAllCourses} = require('../controllers/course');

router.post('/create-course', createCourse);
router.post("/add-enrollment-to-course", addEnrollmentToCourse);
router.post("/add-course-content", addCourseContent);
router.get("/get-all-enrolled-courses", getAllEnrolledCourses);
router.post("/get-all-courses", getAllCourses);

module.exports = router;