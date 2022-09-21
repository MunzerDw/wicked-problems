const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Vote extends Model {}
Vote.init(
  {
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
    vote: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'nodeId'],
      },
    ],
    sequelize: database,
    modelName: 'Vote',
  }
)

Vote.sync()

module.exports = Vote
