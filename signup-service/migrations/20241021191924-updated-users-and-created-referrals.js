'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      phone: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(15),
        allowNull: true,
        unique: false,
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      referral_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('users', ['referral_code'], { unique: true });
    await queryInterface.addIndex('users', ['createdAt']);
    await queryInterface.addIndex('users', ['phone'], { unique: true });

    await queryInterface.createTable('user_referral', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      referrer_user_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      referrer_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      registered_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      registered_user_phone_number: {
        type: Sequelize.STRING(16),
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('user_referral', ['registered_user_id'], { unique: true });
    await queryInterface.addIndex('user_referral', ['registered_user_phone_number'], { unique: true });
    await queryInterface.addIndex('user_referral', ['referrer_user_id']);
    await queryInterface.addIndex('user_referral', ['referrer_user_code']);

    await queryInterface.createTable('user_referral_code', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      ref_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      times_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reached_limit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('user_referral_code', ['ref_code'], { unique: true });
    await queryInterface.addIndex('user_referral_code', ['reached_limit']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_referral_code');
    await queryInterface.dropTable('user_referral');
    await queryInterface.dropTable('users');
  },
};