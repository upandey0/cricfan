const router = require('express').Router()
const {ListmatchesController} = require('../controllers/ListMatchesController')

router.get('/listMatches', ListmatchesController)

module.exports = router