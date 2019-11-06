// sequelize
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    encryptPassword: DataTypes.STRING,
    avatar: DataTypes.STRING
  })
  return User
}