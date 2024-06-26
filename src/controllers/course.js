const Course = require("../models/course");
const User = require("../models/user");
const CourseCoverage = require("../models/course_coverage");
const { getVideoDurationInSeconds } = require('get-video-duration');

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
    res.status(201).json({ courseId: course._id, message: "Course saved successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addCourseContent = async (req, res) => {
  try {
    let { courseId, title, desc, url, contentDuration, thumbnail, notesPdfUrl, weekNumber } =
      req.body;
      if(contentDuration == null && url != null) {
        const videoDuration = await getVideoDurationInSeconds(
          url
        );
        contentDuration = Math.round(videoDuration * 1000);
      }
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
      contentDuration
    };
    const course = await Course.findById(courseId);
    course.contents.push(videoContent);
    await course.save();
    res.status(200).json({ course: course, message: "Content added Successfully" });
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

async function getCourses(filters, query, userId, page, limit) {
  let courses;
  if (filters != null && filters.length > 0) {
    courses = await Course.find({
      $and: [
        {
          $or: [
            { courseName: new RegExp(query, "i") },
            { tags: { $in: filters } },
          ],
        },
        { "studentsEnrolled.studentsId": { $ne: userId } },
      ],
    })
      .skip(page * limit)
      .limit(limit);
  } else {
    courses = await Course.find({
      $and: [
        {
          courseName: new RegExp(query, "i"),
        },
        { "studentsEnrolled.studentsId": { $ne: userId } },
      ],
    })
      .skip(page * limit)
      .limit(limit);
  }
  return courses;
}

const searchCoursesAndMentors = async (req, res) => {
  try {
    const { page, limit, filters, query } = req.body;
    let [users, courses] = await Promise.all([
      User.find({
        name: new RegExp(query, "i"),
        userType: "TEACHER",
      })
        .skip(page * limit)
        .limit(limit),
      getCourses(filters, query, req.user, page, limit),
    ]);

    const instructors = new Map(
      (
        await Promise.all(
          Array.from(
            courses.map((c) =>
              User.findById(c.instructorId).select("name profilePicture")
            )
          )
        )
      ).map((o) => [o._id.toString(), o])
    );
    const courseList = [];
    courses.forEach((c) => {
      let course = c.toObject();
      course.instructorName = instructors.get(c.instructorId).name;
      course.instructorProfilePicture = instructors.get(
        c.instructorId
      ).profilePicture;
      courseList.push(course);
      delete course.contents;
      course.lessons = c.contents.length;
    });
    res.status(200).json({ users, courseList });
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
    res.status(400).json({ message: error });
  }
};

const getRecommendedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const recommendedCourses = await Course.find({
      _id: { $nin: user.courses },
      tags: { $in: user.courseTags },
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

    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const courseId = req.query.id;
    let [course, course_coverage] = await Promise.all([
      Course.findById(courseId),
      CourseCoverage.findOne({ learnerId: req.user, courseId: courseId }),
    ]);
    const instructor = await User.findById(course.instructorId);
    if (course == null) {
      res.status(404).json({ messgae: "Course not found" });
    } else {
      course = course.toObject();
      course.contents = course.contents.sort((a, b) =>
        a.weekNumber > b.weekNumber ? 1 : b.weekNumber > a.weekNumber ? -1 : 0
      );
      course.instructorName = instructor.name;
      let weekMap = new Map();
      for (let i = 0; i < course.contents.length; i++) {
        const c = course.contents[i];
        if (!weekMap.has(c.weekNumber)) {
          weekMap.set(c.weekNumber, i);
        }
      }
      if (course_coverage != null) {
        course_coverage = course_coverage.toObject();
        let quizAttendedMap = new Map();
        course_coverage.quizAttended.forEach((e) => {
          quizAttendedMap.set(e.quizContentId, e);
        });
        course_coverage.quizAttended = Object.fromEntries(quizAttendedMap);
      }
      course.courseCoverage = course_coverage;
      course.weekMap = Object.fromEntries(weekMap);
      res.status(200).json(course);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  createCourse,
  addCourseContent,
  addEnrollmentToCourse,
  getAllEnrolledCourses,
  searchCoursesAndMentors,
  addQuiz,
  getRecommendedCourses,
  getCourse,
};
