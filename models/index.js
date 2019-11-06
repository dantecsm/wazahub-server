import Sequelize from 'sequelize'
const env     = process.env.NODE_ENV || 'development'
const config  = require(__dirname + '/../config/config.json')[env]
const sequelize = new Sequelize(config)


const Blog = sequelize.import('./blog')
const User = sequelize.import('./user')

Blog.user = Blog.belongsTo(User, {as: 'user'})

sequelize.sync(
  // { force: true }
)


export { User, Blog } 
