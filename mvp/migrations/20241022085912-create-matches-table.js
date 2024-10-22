'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('teams', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shortname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true
      },
      match_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'match',   // Reference the matches table
          key: 'id'
        },
        onDelete: 'CASCADE',  // Automatically delete teams if the match is deleted
        onUpdate: 'CASCADE'   // Automatically update teams if the match id changes
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW  // Default to current timestamp
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW  // Default to current timestamp
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('teams');
  }
};