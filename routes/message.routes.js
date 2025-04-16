const express = require('express')
const router = express.Router()
const messageController = require('../controllers/message.controller')

router.get ('/', messageController.message)

module.exports = router