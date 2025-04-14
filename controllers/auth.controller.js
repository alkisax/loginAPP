// https://github.com/mkarampatsis/coding-factory7-nodejs/blob/main/usersApp/controllers/auth.controller.js
// https://fullstackopen.com/en/part4/token_authentication

const bcrypt = require ('bcrypt')
const User = require('../models/users.models')
const authService = require('../services/auth.service')

exports.login = async (req,res) => {
  try {
    // Step 1: Find the user by username
    const user = await User.findOne({username: req.body.username})

    if(!user){
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password'
      })
    }

    const username = req.body.username
    const password = req.body.password

    // Step 2: Check the password
    const isMatch = await authService.verifyPassword (password, user.hashedPassword)

    if(!isMatch){
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password'
      })
    }

    // Step 3: Generate the token
    const token = authService.generateAccessToken(user)

    // Step 4: Return the token and user info
    res.status(200).json({
      status: true,
      data: {
        token: token,
        user: {
          username: user.username,
          email: user.email,
          roles: user.roles,
          id: user._id
        }
      }
    })

  } catch (error) {
    res.status(400).json({
      status: false,
      data: error.message
    })
  }
}

