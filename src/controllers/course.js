const Course = require("../models/course");
const User = require("../models/user");

const createCourse = async (req, res) => {
  try {
    const { courseName, instructorId, price, tags } = req.body;

    let course = new Course({
      courseName: courseName,
      instructorId: instructorId,
      price: price,
      tags: tags,
      studentsEnrolled: {
        totalCount: 0,
        studentsId: [],
      },
      contents: [],
    });
    await course.save();
    res.status(201).json({ message: "Course saved successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const addEnrollmentToCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const [user, course] = await Promise.all([
      User.findById(userId),
      Course.findById(courseId),
    ]);
    if (course == null) {
      return res.status(404).json({ error: "Course Not Found" });
    }
    if (user) {
      if (!user.coursesEnrolled.includes(courseId)) {
        user.coursesEnrolled.push(courseId);
      }
      if (!course.studentsEnrolled.studentsId.includes(userId)) {
        course.studentsEnrolled.studentsId.push(userId);
        course.studentsEnrolled.totalCount++;
      }
      await Promise.all([user.save(), course.save()]);
      res.status(200).json({ message: "Course Enrolled Successfully" });
    } else {
      res.status(404).json({ error: "User Not Found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createCourse, addEnrollmentToCourse };
