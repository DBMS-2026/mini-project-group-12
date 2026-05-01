const { Post } = require('./src/models');
const { connectDB } = require('./src/config/db');

async function test() {
  await connectDB();
  try {
    await Post.bulkCreate([
      { userId: 1, caption: 'Best burger ever 🍔', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', restaurant: 'Burger King', type: 'post' }
    ]);
    console.log('Post created!');
  } catch (error) {
    console.log('Error creating post:', error.message);
  }
  process.exit(0);
}

test();
