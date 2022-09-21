const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Edge extends Model {}
Edge.init(
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
    label: {
      type: DataTypes.STRING,
    },
    target: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    source: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: database,
    modelName: 'Edge',
  }
)

Edge.sync()

module.exports = Edge
