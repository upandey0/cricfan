'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the password column allowing null values
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Update the phone column to allow null values
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the phone column to not allow null values
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    // Remove the password column
    await queryInterface.removeColumn('users', 'password');
  },
};