const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Snapshot extends Model {}
Snapshot.init(
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
    name: {
      type: DataTypes.STRING,
    },
    statistics: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: database,
    modelName: 'Snapshot',
  }
)

Snapshot.sync()

module.exports = Snapshot
