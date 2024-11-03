'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update the password column to increase its length
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING(1024),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the password column to its original length
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};