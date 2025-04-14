// https://github.com/mkarampatsis/coding-factory7-nodejs/blob/main/usersApp/controllers/auth.controller.js
// https://fullstackopen.com/en/part4/token_authentication
const bcrypt = require ('bcrypt')
const User = require('../models/users.models')
const authService = require('../services/auth.service')
const logger = require ('../logger/logger')

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticate the user with username and password to generate a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in and returned user data with token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         roles:
 *                           type: array
 *                           items:
 *                             type: string
 *                         id:
 *                           type: string
 *       401:
 *         description: Invalid username or password
 *       400:
 *         description: Bad request (login error)
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Authentication
 */

exports.login = async (req,res) => {
  try {
    // Step 1: Find the user by username
    const user = await User.findOne({username: req.body.username})

    if(!user){
      logger.warn(`Failed login attempt with username: ${req.body.username}`);
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
      logger.warn(`Failed login attempt with username: ${req.body.username}`);
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password'
      })
    }

    // Step 3: Generate the token
    const token = authService.generateAccessToken(user)
    logger.info(`User ${user.username} logged in successfully`);

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
    logger.error(`Login error: ${error.message}`);
    res.status(400).json({
      status: false,
      data: error.message
    })
  }
}

/**
 * @swagger
 * /api/login/google/callback:
 *   get:
 *     summary: Google Login Callback
 *     description: Callback endpoint for Google login after receiving the authorization code.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The Google OAuth authorization code
 *     responses:
 *       200:
 *         description: User logged in successfully via Google
 *       400:
 *         description: Missing authorization code
 *     tags:
 *       - Authentication
 */

exports.googleLogin = async(req, res) => {
  const code = req.query.code
  if (!code) {
    logger.warn('Auth code is missing during Google login attempt');
    res.status(400).json({status: false, data: "auth code is missing"})
  } else {
    let {user} = await authService.googleAuth(code)
    if (user && user.email) {
      logger.info(`User ${user.email} logged in via Google`);
    } else {
      logger.info('Google login succeeded, but user info is incomplete');
    }
    return res.redirect('https://www.wikipedia.org')
  }
}

