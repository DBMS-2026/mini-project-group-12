const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'food_creed.sqlite');
const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    process.exit(1);
  }
});

let seedSql = fs.readFileSync(seedPath, 'utf-8');

// Remove USE food_creed;
seedSql = seedSql.replace(/USE food_creed;/g, '');

// Remove all SQL comments
seedSql = seedSql.replace(/--.*/g, '');

const queries = seedSql.split(';').map(q => q.trim()).filter(q => q.length > 0);

const processQuery = (q) => {
  // Add createdAt and updatedAt to INSERT queries
  if (q.toUpperCase().startsWith('INSERT INTO')) {
    return q
      .replace(/\(([^)]+)\)\s+VALUES/i, function(match, p1) {
        return '(createdAt, updatedAt, ' + p1 + ') VALUES';
      })
      .replace(/VALUES\s*\(/i, 'VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ')
      .replace(/\),\s*\(/g, '), (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ');
  }
  return q;
};

const newQueries = queries.map(processQuery);

db.serialize(() => {
  db.run('DELETE FROM saved_posts');
  db.run('DELETE FROM likes');
  db.run('DELETE FROM comments');
  db.run('DELETE FROM posts');
  db.run('DELETE FROM followers');
  db.run('DELETE FROM orders');
  db.run('DELETE FROM menu_items');
  db.run('DELETE FROM restaurants');
  db.run('DELETE FROM users');

  db.run("DELETE FROM sqlite_sequence", (err) => {});

  console.log('Cleared existing data.');

  let completed = 0;
  newQueries.forEach((query) => {
    db.run(query, (err) => {
      if (err) {
        console.error('Error executing query:', err.message);
        console.error('Query:', query.substring(0, 80) + '...');
      }
      completed++;
      if (completed === newQueries.length) {
        console.log('Seeding complete. Added reels and posts!');
        db.close();
      }
    });
  });
});
