const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Evidence extends Model {}
Evidence.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      noUpdate: true,
      unique: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      noUpdate: true,
    },
    nodeId: {
      type: DataTypes.UUID,
      allowNull: false,
      noUpdate: true,
    },
    text: {
      type: DataTypes.TEXT,
    },
    file: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: database,
    modelName: 'Evidence',
  }
)

Evidence.sync()

module.exports = Evidence
