const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../database/food_creed.sqlite');
db.all("SELECT count(*) as c, type FROM posts GROUP BY type", (err, rows) => {
  console.log('Posts by type:', rows);
});
db.all("SELECT id, caption, videoUrl FROM posts WHERE type='reel' LIMIT 3", (err, rows) => {
  console.log('Sample reels:', JSON.stringify(rows, null, 2));
  db.close();
});
