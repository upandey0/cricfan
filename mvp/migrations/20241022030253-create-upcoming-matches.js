'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('UpcomingMatches', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
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
                type: Sequelize.STRING,
                allowNull: false
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
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('UpcomingMatches');
    }
};
