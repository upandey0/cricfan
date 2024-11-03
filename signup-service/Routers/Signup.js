const express = require('express');
const router = express.Router();
const SignupController = require('../controllers/SignupController');
const validators = require('../middlewares/validators');
const { validateSessionInReq } = require('../middlewares/sessionValidation');

// Existing OTP routes
router.post(
  '/request-otp',
  validators.validateRequestBodyForRequestOTP,
  SignupController.requestOTP
);
router.post(
  '/verify-otp',
  validators.validateRequestBodyForVerifyOTP,
  SignupController.verifyOTP
);
router.post(
  '/resend-otp',
  validators.validateRequestBodyForRequestOTP,
  SignupController.resendOTP
);

// Signup route
router.post(
  '/signup',
  validators.validateRequestBodyForSignup,
  SignupController.signup
);

// Login route
router.post(
  '/login',
  validators.validateRequestBodyForLogin,
  SignupController.login
);

module.exports = router;