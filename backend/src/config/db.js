const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

const useMySQL = process.env.USE_MYSQL === 'true';

if (useMySQL) {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'food_creed',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    }
  );
} else {
  // SQLite fallback (no external DB needed)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', '..', '..', 'database', 'food_creed.sqlite'),
    logging: false,
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database connected (${sequelize.getDialect()})`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
