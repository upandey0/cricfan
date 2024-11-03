'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true, // Allow null values temporarily
    });

    // Step 2: Update existing rows to set a default or hashed password
    await queryInterface.sequelize.query(
      `UPDATE users SET password = 'default_password' WHERE password IS NULL`
    );

    // Step 3: Alter the column to not allow null values
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'password');
  },
};