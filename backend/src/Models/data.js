const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Data extends Model {}
Data.init(
  {
    snapshotId: {
      type: DataTypes.UUID,
      allowNull: false,
      noUpdate: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      noUpdate: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['date', 'snapshotId'],
      },
    ],
    sequelize: database,
    modelName: 'Data',
  }
)

Data.sync()

module.exports = Data
