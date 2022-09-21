const { DataTypes, Model } = require('sequelize')
const database = require('../Services/database')

class Test extends Model {
  static getAllTests() {
    return this.findAll()
  }
  getText() {
    return this.text
  }
}
Test.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: database, // We need to pass the connection instance
    modelName: 'Test', // We need to choose the model name
  }
)

Test.sync()

module.exports = Test
