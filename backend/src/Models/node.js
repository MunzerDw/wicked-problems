const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Node extends Model {}
Node.init(
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
    labelId: {
      type: DataTypes.UUID,
    },
    text: {
      type: DataTypes.STRING,
    },
    x: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    y: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['QUESTION', 'CONSTRAINT', 'ARGUMENT', 'IDEA', 'ACTION'],
      allowNull: false,
    },
    for: {
      type: DataTypes.BOOLEAN,
    },
    doneAt: {
      type: DataTypes.DATE,
    },
    selectedBy: {
      type: DataTypes.STRING,
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['selectedBy', 'projectId'],
      },
    ],
    sequelize: database,
    modelName: 'Node',
  }
)

Node.sync()

module.exports = Node
