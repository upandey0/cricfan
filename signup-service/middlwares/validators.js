// middlewares/validators.js
const { check, validationResult } = require('express-validator');

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
  check('phone').isMobilePhone().withMessage('Invalid phone number'),
  check('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
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
};
