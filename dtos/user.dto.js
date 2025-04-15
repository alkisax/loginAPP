const toUserDTO = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    name: user.name,
    roles: user.roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

module.exports = {
  toUserDTO
};