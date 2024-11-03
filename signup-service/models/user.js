'use strict';

const bcrypt = require('bcrypt');

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
        allowNull: true,
        validate: {
          isValidPhone(value) {
            // Basic validation for phone numbers
            if(value) {
            if (!/^\+?[1-9]\d{1,14}$/.test(value)) {
              throw new Error('Invalid phone number format');
            }
          }
          },
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: false,
      },
      password: {
        type: DataTypes.STRING(1024),
        allowNull: true,
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
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  User.prototype.validPassword = async function (password) {
    console.log('password', this.password);
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
        throw new Error('Invalid password');
    }
    return isMatch;
  };

  return User;
};