'use strict'
const {DataTypes} = require('sequelize')

const sequelize = require('../config/config.json')

const User = sequelize.define('User', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        allowNull: false,
        unique: true
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, 
    password: {
        type: DataTypes.STRING,
        allowNull: false
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
    }
},
{
    tableName: 'users',
    timestamps : true
})

module.exports = User