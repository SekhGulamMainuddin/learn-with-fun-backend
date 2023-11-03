const express = require('express');
const router = express.Router();
const {createCourse, addEnrollmentToCourse} = require('../controllers/course');

router.post('/create-course', createCourse);
router.post("/add-enrollment-to-course", addEnrollmentToCourse);

module.exports = router;