'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Scores', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      match_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'PastMatches',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      inning: {
        type: Sequelize.STRING,
        allowNull: false
      },
      r: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      w: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      o: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Scores');
  }
};
