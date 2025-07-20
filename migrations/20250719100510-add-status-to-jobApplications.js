'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('job_applications', 'status', {
      type: Sequelize.ENUM('pending', 'shortlisted', 'rejected'),
      defaultValue: 'pending',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('job_applications', 'status')
  },
}
