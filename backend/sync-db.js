const { sequelize } = require('./src/models');
const { connectDB } = require('./src/config/db');

async function sync() {
  await connectDB();
  await sequelize.sync();
  console.log('Database synced');
  process.exit(0);
}

sync();
