const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Project extends Model {}
Project.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      noUpdate: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      noUpdate: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    urlSafeName: {
      type: DataTypes.STRING,
      unique: true,
    },
    public: {
      type: DataTypes.BOOLEAN,
    },
    wickedProblemQuestions: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: database,
    modelName: 'Project',
  }
)

Project.sync()

module.exports = Project
