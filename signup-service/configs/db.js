const { Sequelize } = require('sequelize');
const secrets = require('./config.json')

// Initialize Sequelize with PostgreSQL credentials
const sequelize = new Sequelize(secrets.PGDATABASE, secrets.PGUSER, secrets.PGPASSWORD, {
    host: secrets.PGHOST,
    dialect: 'postgres',
    port: secrets.PGPORT,
    logging: false, 
});

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true }); 
        console.log('Database synchronized!');
    } catch (error) {
        console.error('Error synchronizing the database:', error);
    }
};

module.exports = { sequelize, syncDB };

