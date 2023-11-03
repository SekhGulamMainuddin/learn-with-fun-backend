const express = require('express');
const router = express.Router();
const {createCourse, addEnrollmentToCourse, addCourseContent} = require('../controllers/course');

router.post('/create-course', createCourse);
router.post("/add-enrollment-to-course", addEnrollmentToCourse);
router.post("/add-course-content", addCourseContent);

module.exports = router;