const Course = require("../models/course");
const User = require("../models/user");

const createCourse = async (req, res) => {
  try {
    const { courseName, courseDesc, courseThumbnail, price, tags, weekNumber } = req.body;
    let course = new Course({
      courseName: courseName,
      courseDesc: courseDesc,
      courseThumbnail: courseThumbnail,
      instructorId: req.user,
      price: price,
      tags: tags,
      studentsEnrolled: {
        totalCount: 0,
        studentsId: [],
      },
      contents: [],
      weekNumber: weekNumber,
    });
    course = await course.save();
    let user = await User.findById(req.user);
    user.courses.push(course._id);
    await user.save();
    res.status(201).json({ message: "Course saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addCourseContent = async (req, res) => {
  try {
    const { courseId, title, desc, url, thumbnail, notesPdfUrl } =
      req.body;
    console.log(quiz);
    let videoContent = {
      title: title,
      desc: desc,
      url: url,
      thumbnail: thumbnail,
      viewsIdList: [],
      likesIdList: [],
      quiz: [],
      notesPdfUrl: notesPdfUrl,
    };
    const course = await Course.findById(courseId);
    course.contents.push(videoContent);
    await course.save();
    res.status(200).json({ message: "Content added Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addEnrollmentToCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const [user, course] = await Promise.all([
      User.findById(req.user),
      Course.findById(courseId),
    ]);
    if (course == null) {
      return res.status(404).json({ error: "Course Not Found" });
    }
    if (user) {
      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
      }
      if (!course.studentsEnrolled.studentsId.includes(req.user)) {
        course.studentsEnrolled.studentsId.push(req.user);
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

const getAllEnrolledCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({
      "studentsEnrolled.studentsId": req.user,
    });
    res.status(200).json(allCourses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const { page, limit, filters } = req.body;
    let courses;
    if (filters != null && filters.length > 0) {
      courses = await Course.find({ tags: { $in: filters } })
        .skip(page * limit)
        .limit(limit);
    } else {
      courses = await Course.find()
        .skip(page * limit)
        .limit(limit);
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCourse,
  addCourseContent,
  addEnrollmentToCourse,
  getAllEnrolledCourses,
  getAllCourses,
};
