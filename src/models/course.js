const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    instructorId: {
        type: String,
        required: true,
    },
    studentsEnrolled: {
        totalCount: {
            type: Integer,
            defaultValue: 0
        },
        studentsId: [String],
    }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = courseSchema;
