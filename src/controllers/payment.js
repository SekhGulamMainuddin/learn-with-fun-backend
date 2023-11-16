const Payment = require("../models/payment");
const Course = require("../models/course");
const User = require("../models/user");
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

const getBraintreePaymentToken = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({
      merchantAccountId: process.env.MERCHANT_ID,
    });
    res.status(201).json({ paymentToken: response.clientToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { nonce, deviceData, amount, courseId } = req.body;
    const result = await gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonce,
      deviceData: deviceData,
      options: {
        submitForSettlement: true,
      },
    });
    if (result.success) {
      let payment = new Payment({
        userId: req.user,
        courseId,
        status: "SUCCESS",
      });
      const [course, user] = await Promise.all([
        Course.findById(courseId),
        User.findById(req.user),
      ]);
      user.courses.push(course._id);
      course.studentsEnrolled.studentsId.push(req.user);
      course.studentsEnrolled.totalCount++;
      await Promise.all([user.save(), course.save(), payment.save()]);
      res.status(200).json({ message: "Course Enrolled Successfully" });
    } else {
      res.status(400).json({ message: "Payment Failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getBraintreePaymentToken, verifyPayment };
