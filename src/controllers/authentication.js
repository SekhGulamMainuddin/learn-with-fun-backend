const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
})

const sendOTP = async (req, res) => {
    const { countryCode, phoneNumber } = req.body;
    try{
        const otpResponse = await client.verify
        .v2.services(TWILIO_SERVICE_SID)
        .verifications.create({
            to: `+${countryCode}${phoneNumber}`,
            channel: "sms",
        });
        res.status(200).json({"body": JSON.stringify(otpResponse)});
    }
    catch(error) {
        res.status(error?.status || 400).json({error: error?.message || 'Soomething went wrong!'});
    }
};

const verifyOTP = async (req, res) => {
    const { countryCode, phoneNumber, otp } = req.body;
    try{
        const verifiedResponse = await client.verify
        .v2.services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp,
        });
        res.status(200).json({"body": JSON.stringify(verifiedResponse)});
    }
    catch(error) {
        res.status(error?.status || 400).json({error: error?.message || 'Soomething went wrong!'});
    }
};

module.exports = {sendOTP, verifyOTP}