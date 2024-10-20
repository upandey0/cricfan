const router = require('express').Router()
const {SignupController} = require('../controllers/SignupController')

router.post('/signup',SignupController )

module.exports = router