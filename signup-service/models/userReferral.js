'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserReferral = sequelize.define(
    'UserReferral',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      referrer_user_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      referrer_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      registered_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      registered_user_phone_number: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'user_referral',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['registered_user_id'],
        },
        {
          unique: true,
          fields: ['registered_user_phone_number'],
        },
        {
          fields: ['referrer_user_id'],
        },
        {
          fields: ['referrer_user_code'],
        },
      ],
    }
  );
  return UserReferral;
};