const express = require("express");
const { createUser, addEnrollmentToCourse } = require("../controllers/user");
const router = express.Router();

router.post("/create-user", createUser);
router.post("/add-enrollment-to-course", addEnrollmentToCourse);

module.exports = router;
