module.exports = {
  INVALID_PHONE_NUMBER: {
    code: 400,
    message: 'Phone number is required',
  },
  USER_NOT_ELIGIBLE: {
    code: 403,
    message: 'User is not eligible to register',
  },
  INVALID_REFERRAL_CODE: {
    code: 400,
    message: 'Invalid or expired referral code',
  },
  INVALID_SESSION: {
    code: 400,
    message: 'Invalid session. Please start new authentication',
  },
  INVALID_OTP: {
    code: 400,
    message: 'Invalid OTP',
  },
  EMAIL_ALREADY_IN_USE: {
    code: 400,
    message: 'Email already in use',
  },
  INVALID_CREDENTIALS: {
    code: 401,
    message: 'Invalid email or password',
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Internal server error',
  },
};