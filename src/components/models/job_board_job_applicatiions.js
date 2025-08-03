'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class job_board_job_applicatiions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  job_board_job_applicatiions.init(
    {
      username: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'job_board_job_applicatiions',
    },
  )
  return job_board_job_applicatiions
}
