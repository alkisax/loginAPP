const User = require('../models/users.models');

const findAllUsers = async () => {
  return await User.find();
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId)
}

module.exports = {
  findAllUsers,
  findUserByUsername,
  findUserByEmail,
  createUser,
  deleteUserById
};
