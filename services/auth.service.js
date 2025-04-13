const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

generateAccessToken = (user) => {
  const payload = {
    username: user.username,
    email: user.email,
    rolles: user.roles,
    id: user._id
  }

  const secret = process.env.SECRET
  const options = {
    expiresIn: '1h'
  }
  const token = jwt.sign(payload, secret, options)
}

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const verifyAccessToken = (token) => {
  const secret = process.env.SECRET
  try {
    const payload = jwt.verify(token, secret)
    return { 
      cerified: true, data: payload
    }
  } catch (error) {
    return { 
      cerified: false, data: error.message
    }
  }
} 

module.exports = {
  generateAccessToken,
  verifyPassword,
  verifyAccessToken
}