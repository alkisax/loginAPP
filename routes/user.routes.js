const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller.js')

router.get ('/', userController.findAll)
router.post('/', userController.create)

module.exports = router