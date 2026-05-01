const { sequelize } = require('./src/models');
const { connectDB } = require('./src/config/db');
const app = require('./src/app');

async function reset() {
  await connectDB();
  await sequelize.sync({ force: true });
  console.log('Database forcefully synced (dropped and recreated)');
  
  // The seed logic is in server.js but not exported. We'll just run server.js which will seed it.
  process.exit(0);
}

reset();
