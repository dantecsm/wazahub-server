export default (sequelize, DataTypes, Foreign) => {
  const Blog = sequelize.define('Blog', {
    title: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    content: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    atIndex: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  })
  return Blog
}
