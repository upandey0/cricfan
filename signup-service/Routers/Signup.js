const router = require('express').Router();
const SignupController = require('../controllers/SignupController');
const validators = require('../middlewares/validators');
const { validateSessionInReq } = require('../middlewares/sessionValidation');

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

router.post(  
  '/logout', validateSessionInReq,
  SignupController.logout
);


module.exports = router;
