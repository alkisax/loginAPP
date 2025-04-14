const bcrypt = require('bcrypt')
const User = require('../models/users.models')
const authService = require('../services/auth.service')
const logger = require('../logger/logger')

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users from the database (admin access required).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: string
 *                       id:
 *                         type: string
 *       401:
 *         description: Unauthorized access (invalid or missing token)
 *       403:
 *         description: Forbidden access (non-admin role)
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Users
 */

exports.findAll = async (req,res) => {
  const results = await User.find()

  // const token = authService.getTokenFrom(req)
  // const verificationResult  = authService.verifyAccessToken(token)
  // if (!verificationResult.verified) {
  //   logger.warn(`Unauthorized access attempt by token: ${token}`);
  //   return res.status(401).json({
  //     status: false,
  //     error: verificationResult.data
  //   })
  // }
  // if (!verificationResult.data.roles.includes('admin')) {
  //   logger.warn(`Forbidden access attempt by user: ${verificationResult.data.username}`);
  //   return res.status(403).json({
  //     status: false,
  //     error: 'Forbidden'
  //   })
  // }

  res.json({
    status: true,
    data: results
  })
}
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user in the system with provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User successfully created
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
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Bad request (invalid data)
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Users
 */
exports.create = async (req,res) => {
  let data = req.body

  const username = req.body.username
  const name = req.body.name
  const password = req.body.password
  const email = req.body.email
  const roles = req.body.roles

  const SaltOrRounds = 10
  const hashedPassword = await bcrypt.hash(password, SaltOrRounds)

  // na prostethei elegxos me if

  try {
    const newUser = new User({
      username: username,
      name: name,
      hashedPassword: hashedPassword,
      email: email,
      roles: roles
    })
    await newUser.save()
    logger.info(`Created new user: ${username}`);
    res.status(201).json(newUser)
  } catch(error) {
    logger.error(`Error creating user: ${error.message}`);
    res.status(400).json({error: error.message})
  }
}