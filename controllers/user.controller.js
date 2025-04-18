const bcrypt = require('bcrypt')
const User = require('../models/users.models')
const authService = require('../services/auth.service')
const logger = require('../logger/logger')
const userDAO = require('../daos/user.dao')
const { toUserDTO } = require('../dtos/user.dto')

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
  try {

    if (!req.headers.authorization) {
      return res.status(401).json({ status: false, error: 'No token provided' });
    }

    const users = await userDAO.findAllUsers();
    res.status(200).json({ status: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal server error' });
  }

  // const users = await userDAO.findAllUsers();
  // res.json({ status: true, data: users });
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

  try {

    const newUser = await userDAO.createUser({
      username,
      name,
      email,
      roles,
      hashedPassword
    });

    logger.info(`Created new user: ${username}`);
    res.status(201).json(newUser)
  } catch(error) {
    logger.error(`Error creating user: ${error.message}`);
    res.status(400).json({error: error.message})
  }
}