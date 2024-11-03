const { check, validationResult } = require('express-validator');

// Existing OTP validators
const validateRequestBodyForRequestOTP = [
  check('phone').isMobilePhone().withMessage('Invalid phone number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateRequestBodyForVerifyOTP = [
  check('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// New signup validators
const validateRequestBodyForSignup = [
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('first_name').not().isEmpty().withMessage('First name is required'),
  check('last_name').not().isEmpty().withMessage('Last name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// New login validators
const validateRequestBodyForLogin = [
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('password').not().isEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRequestBodyForRequestOTP,
  validateRequestBodyForVerifyOTP,
  validateRequestBodyForSignup,
  validateRequestBodyForLogin,
};