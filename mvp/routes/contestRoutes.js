const router = require('express').Router()
const {ListContests}= require('../controllers/GenerateAndListContests')

router.get('/list-contests',ListContests)

module.exports = router