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
    AUTHENTICATION_FAILED: {
      code: 500,
      message: 'Authentication failed',
    },
    FAILED_TO_SEND_OTP: {
      code: 500,
      message: 'Failed to send OTP',
    },
    FAILED_TO_RESEND_OTP: {
      code: 500,
      message: 'Failed to resend OTP',
    },
    FAILED_TO_LOGOUT: {
      code: 500,
      message: 'Failed to logout session',
    },
    REFERRAL_CODE_NOT_FOUND: {
      code: 404,
      message: 'Referral code not found',
    },
    REFERRAL_CODE_LIMIT_REACHED: {
      code: 400,
      message: 'Referral code has reached its limit',
    },
    ERROR_SAVING_REFERRAL_CODE: {
      code: 500,
      message: 'Error saving referral code in Redis',
    },
  };