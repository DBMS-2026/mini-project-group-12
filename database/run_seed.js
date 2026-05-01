const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'food_creed.sqlite');
const seedPath = path.join(__dirname, 'seed.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    process.exit(1);
  }
});

let seedSql = fs.readFileSync(seedPath, 'utf-8');

// Remove USE food_creed;
seedSql = seedSql.replace(/USE food_creed;/g, '');

const queries = seedSql.split(';').map(q => q.trim()).filter(q => q.length > 0);

db.serialize(() => {
  db.run('DELETE FROM saved_posts');
  db.run('DELETE FROM likes');
  db.run('DELETE FROM comments');
  db.run('DELETE FROM posts');
  db.run('DELETE FROM followers');
  db.run('DELETE FROM menu_items');
  db.run('DELETE FROM restaurants');
  db.run('DELETE FROM users');

  // Also reset sqlite sequence if it exists
  db.run("DELETE FROM sqlite_sequence", (err) => {
    // Ignore error if sqlite_sequence doesn't exist
  });

  console.log('Cleared existing data.');

  let completed = 0;
  queries.forEach((query) => {
    db.run(query, (err) => {
      if (err) {
        console.error('Error executing query:', err.message);
        console.error('Query:', query.substring(0, 50) + '...');
      }
      completed++;
      if (completed === queries.length) {
        console.log('Seeding complete.');
        db.close();
      }
    });
  });
});
