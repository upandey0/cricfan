'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('matches', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true
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
                allowNull: true
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
            matchStatus: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('matches');
    }
};
