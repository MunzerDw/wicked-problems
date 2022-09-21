const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Invite extends Model {}
Invite.init(
  {
    hostId: {
      type: DataTypes.STRING,
      allowNull: false,
      noUpdate: true,
    },
    guestId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      noUpdate: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      noUpdate: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['projectId', 'email'],
      },
    ],
    sequelize: database,
    modelName: 'Invite',
  }
)

Invite.sync()

module.exports = Invite
