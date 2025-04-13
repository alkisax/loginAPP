const bcrypt = require('bcrypt')
const User = require('../models/users.models')

exports.findAll = async (req,res) => {
 const results = await User.find()
 res.json({
  status: true,
  data: results
})
}

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
    res.status(201).json(newUser)
  } catch(error) {
    res.status(400).json({error: error.message})
  }
}