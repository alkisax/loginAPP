// https://github.com/mkarampatsis/coding-factory7-nodejs/blob/main/usersApp/controllers/auth.controller.js
// https://fullstackopen.com/en/part4/token_authentication

const bcrypt = require ('bcrypt')
const User = require('../models/users.models')
const authService = require('../services/auth.service')

exports.login = async (req,res) => {
  const username = req.body.username
  const password = req.body.password

//TODO

  try {
    const result = await User.findOne({username: username},{username:1, email:1, password:1, roles:1})
    const isMatch = await authService.verifyPassword (password, )
  } catch (error) {
    res.status(400).json({
      status: false,
      data: error.message
    })
  }

}

