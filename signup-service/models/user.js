'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    phone: {
      type: DataTypes.STRING(15), // Changed to STRING to handle phone numbers properly
      unique: true,
      allowNull: false,
      validate: {
        isValidPhone(value) {
          // Basic validation for phone numbers
          if (!/^\+?[1-9]\d{1,14}$/.test(value)) {
            throw new Error('Invalid phone number format');
          }
        }
      }
    }
  }, {
    tableName: 'users',
    timestamps: true
  });
  return User;
};