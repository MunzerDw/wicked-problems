const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Label extends Model {}
Label.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      noUpdate: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      noUpdate: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      noUpdate: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: 'Label',
  }
)

Label.sync()

module.exports = Label
