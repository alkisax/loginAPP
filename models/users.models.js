const mongoose = require("mongoose")

const Schema = mongoose.Schema
const userSchema = new Schema({
  username:{
    type: String,
    required: [true, 'username is required'],
    unique:true
  },
  name:{
    type: String,
    required: false
  },
  roles:{
    type: [String],
    default: ['user']
  },
  email:{
    type: String,
    required: false,
    unique: true
  },
  // password:{
  //   type: String,
  //   required: [true, 'password is required'],
  // },
  hashedPassword: {
    type: String,
    required: [true, 'password is required'],
  }
},
{
  collection: 'users',
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)