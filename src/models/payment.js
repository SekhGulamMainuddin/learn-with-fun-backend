const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILED'],
        required: true,
    }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;