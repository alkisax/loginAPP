const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

generateAccessToken = (user) => {
  const payload = {
    username: user.username,
    email: user.email,
    roles: user.roles,
    id: user._id
  }

  const secret = process.env.SECRET
  const options = {
    expiresIn: '1h'
  }
  const token = jwt.sign(payload, secret, options)
  return token
}

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const verifyAccessToken = (token) => {
  const secret = process.env.SECRET
  try {
    const payload = jwt.verify(token, secret)
    return { 
      verified: true, data: payload
    }
  } catch (error) {
    return { 
      verified: false, data: error.message
    }
  }
}

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.replace('Bearer ', '')
    console.log(token)
    return token    
  }
  return null
}

module.exports = {
  generateAccessToken,
  verifyPassword,
  verifyAccessToken,
  getTokenFrom
}