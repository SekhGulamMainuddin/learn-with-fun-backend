const {
  getBraintreePaymentToken,
  verifyPayment,
} = require("../controllers/payment");
const router = require("express").Router();
const auth = require("../middlewares/auth");

router.get("/payment/token", auth, getBraintreePaymentToken);
router.post("/payment/verify-payment", auth, verifyPayment);

module.exports = router;
