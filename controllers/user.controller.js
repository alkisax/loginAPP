const User = require('../models/users.models')

exports.findAll = async (req,res) => {
 const results = await User.find()
 res.json({
  status: true,
  data: results
})
}

exports.create = async (req,res) => {
  const username = req.body.username
  const password = req.body.password

  // na prostethei elegxos me if

  try {
    const newUser = new User({
      username: username,
      password: password
    })
    await newUser.save()
    res.status(201).json(newUser)
  } catch(error) {
    res.status(400).json('error', error.message)
  }
}