const jwt = require('jsonwebtoken')
const User = require('../models/users.models.js')
const { verifyAccessToken } = require('../services/auth.service.js')

const getTokenFrom = (req) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}