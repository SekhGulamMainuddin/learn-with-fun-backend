const User = require("../models/user");

const createUser = async (req, res) => {
    try{
        const {name, email, countryCode, phoneNumber, type, profilePicture} = req.body;
        const phone = {
            countryCode: countryCode,
            phoneNumber: phoneNumber
        };
        let user = new User({name, email, phone, type, profilePicture, coursesEnrolled: []});
        user = await user.save();
        return res.status(201).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const addEnrollmentToCourse = async (req, res) => {
    try {
        const {courseId} = req.body;
        let user = await User.findById(req.user);
        if(user) {
            await user.coursesEnrolled.push(courseId);
            user.save();
            res.status(200).json({message: "Course Enrolled Successfully"});
        }else{
            res.status(404).json({error: "User Not Found"});
        }
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

module.exports = {createUser, addEnrollmentToCourse};
