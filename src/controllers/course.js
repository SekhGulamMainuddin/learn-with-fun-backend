const Course = require("../models/course");
const User = require("../models/user");
const CourseCoverage = require("../models/course_coverage");

const createCourse = async (req, res) => {
  try {
    const { courseName, courseDesc, courseThumbnail, price, tags } = req.body;
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
    });
    course = await course.save();
    let user = await User.findById(req.user);
    user.courses.push(course._id);
    await user.save();
    res.status(201).json({ message: "Course saved successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addCourseContent = async (req, res) => {
  try {
    const { courseId, title, desc, url, thumbnail, notesPdfUrl, weekNumber } =
      req.body;
    let videoContent = {
      title,
      desc,
      url,
      thumbnail,
      viewsIdList: [],
      likesIdList: [],
      quiz: [],
      notesPdfUrl,
      weekNumber,
    };
    const course = await Course.findById(courseId);
    course.contents.push(videoContent);
    await course.save();
    res.status(200).json({ message: "Content added Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      return res.status(404).json({ message: "Course Not Found" });
    }
    if (user) {
      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
      }
      if (!course.studentsEnrolled.studentsId.includes(req.user)) {
        course.studentsEnrolled.studentsId.push(req.user);
        course.studentsEnrolled.totalCount++;
      }
      await Promise.all([
        user.save(),
        course.save(),
        new CourseCoverage({
          learnerId: req.user,
          courseId: course._id,
          contentCovered: [],
          quizAttended: [],
        }).save(),
      ]);
      res.status(200).json({ message: "Course Enrolled Successfully" });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllEnrolledCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({
      "studentsEnrolled.studentsId": req.user,
    }).select("courseName courseThumbnail instructorId ");
    res.status(200).json(allCourses);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
  }
};

const addQuiz = async (req, res) => {
  try {
    const { courseId, contentId, questions } = req.body;
    let course = await Course.findById(courseId);
    if (course == null) {
      return res.status(404).json({ message: "Course Not Found" });
    } else {
      for (let i = 0; i < course.contents.length; i++) {
        if (course.contents[i]._id.toString() === contentId) {
          course.contents[i].quiz.push.apply(
            course.contents[i].quiz,
            questions
          );
          break;
        }
      }
      await course.save();
      res.status(200).json({ message: "Quiz Added Successfully", course });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRecommendedCourses = async (req, res) => {
  try {
    const { tags } = req.body;
    const user = await User.findById(req.user);
    const recommendedCourses = await Course.find({
      _id: { $nin: user.courses },
      tags: { $in: tags },
    })
      .sort({ "studentsEnrolled.totalCount": -1 })
      .select("courseName courseThumbnail")
      .limit(5);
    let course_fetch_earlier = recommendedCourses.map((course) => {
      return course._id;
    });
    course_fetch_earlier.push(...user.courses);
    const popularCourses = await Course.find({
      _id: { $nin: course_fetch_earlier },
    })
      .sort({ "studentsEnrolled.totalCount": -1 })
      .select("courseName courseThumbnail")
      .limit(5);

    const courses = [];
    popularCourses.forEach((o) => {
      var c = o.toObject();
      c.tag = "Popular";
      courses.push(c);
    });
    recommendedCourses.forEach((o) => {
      var c = o.toObject();
      c.tag = "Recommended";
      courses.push(c);
    });
    
    res.status(200).json({courses});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  addCourseContent,
  addEnrollmentToCourse,
  getAllEnrolledCourses,
  getAllCourses,
  addQuiz,
  getRecommendedCourses,
};
