'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PastMatches', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      matchType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING
      },
      venue: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      dateTimeGMT: {
        type: Sequelize.DATE,
        allowNull: false
      },
      teams: {
        type: Sequelize.JSON,
        allowNull: false
      },
      series_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      fantasyEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      bbbEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      hasSquad: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      matchStarted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      matchEnded: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('PastMatches');
  }
};
    