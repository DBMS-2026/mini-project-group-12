const { getSuggestedUsers } = require('./src/services/userService');
const { connectDB } = require('./src/config/db');

async function test() {
  await connectDB();
  const suggested = await getSuggestedUsers(6); // assuming user 6
  console.log('Suggested for user 6:', suggested.map(u => u.id));
  process.exit(0);
}

test();
