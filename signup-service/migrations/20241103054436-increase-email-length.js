'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update the email column to increase its length
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the email column to its original length
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING(15),
      allowNull: true,
    });
  },
};