const { Sequelize } = require('sequelize');
const secrets = require('./config.json');

// Initialize Sequelize with PostgreSQL credentials
const sequelize = new Sequelize(
  secrets.PGDATABASE,
  secrets.PGUSER,
  secrets.PGPASSWORD,
  {
    host: secrets.PGHOST,
    dialect: 'postgres',
    port: secrets.PGPORT,
    logging: false,
  }
);

const syncDB = async () => {
  try {
    // Force sync in development only
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync with { force: true } will drop and recreate tables
    await sequelize.sync({ force: false });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

module.exports = { sequelize, syncDB };
