'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Contests', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            match_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'UpcomingMatches', // name of the referenced model
                    key: 'id'               // key in the referenced model
                },
                onDelete: 'CASCADE', // optional: define what happens on delete
                onUpdate: 'CASCADE'   // optional: define what happens on update
            },
            contest_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            is_active : {
              type: Sequelize.BOOLEAN,
              allowNull: false
            },
            contest_type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            
            entry_fee: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Contests');
    }
};
