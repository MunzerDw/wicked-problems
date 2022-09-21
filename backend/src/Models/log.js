const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Log extends Model {}
Log.init(
  {
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
    nodeId: {
      type: DataTypes.UUID,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['CREATE', 'UPDATE', 'DELETE'],
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: database,
    modelName: 'Log',
  }
)

Log.sync()

module.exports = Log
