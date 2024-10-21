'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      phone: {
        type: DataTypes.STRING(255), // Changed to match SQL definition
        unique: true,
        allowNull: false,
        validate: {
          isValidPhone(value) {
            // Basic validation for phone numbers
            if (!/^\+?[1-9]\d{1,14}$/.test(value)) {
              throw new Error('Invalid phone number format');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: false,
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      referral_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true,

      indexes: [
        {
          unique: true,
          fields: ['referral_code'],
        },
        {
          fields: ['createdAt'],
        },
        {
          unique: true,
          fields: ['phone'],
        },
      ],
    }
  );
  return User;
};