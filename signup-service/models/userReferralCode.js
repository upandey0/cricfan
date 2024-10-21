'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserReferralCode = sequelize.define(
    'UserReferralCode',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      ref_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      times_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reached_limit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'user_referral_code',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['ref_code'],
        },
        {
          fields: ['reached_limit'],
        },
      ],
    }
  );
  return UserReferralCode;
};