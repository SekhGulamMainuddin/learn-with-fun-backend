const User = require("../models/user");

const createUser = async (req, res) => {
    try{
        const {name, email, countryCode, phoneNumber, userType, profilePicture} = req.body;
        const phone = {
            countryCode: countryCode,
            phoneNumber: phoneNumber
        };
        let user = new User({name, email, phone, userType, profilePicture, courses: []});
        user = await user.save();
        return res.status(201).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {createUser};
