const router = require('express').Router()
const {requestOTPController,verifyOTPController,resendOTPController} = require('../controllers/SignupController')

router.post('/request-otp',requestOTPController)
router.post('/verify-otp', verifyOTPController)
router.post('/resend-otp', resendOTPController)

module.exports = router