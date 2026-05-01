const { User, Post, Follow, Like } = require('./src/models');
const { connectDB } = require('./src/config/db');

const seedSneha = async () => {
  await connectDB();
  try {
    const sneha = await User.findOne({ where: { username: 'Maddineni' } });
    if (!sneha) {
      console.log('Sneha user not found');
      process.exit();
    }

    const otherUsers = await User.findAll({ where: { id: { [require('sequelize').Op.ne]: sneha.id } } });

    // 1. Create posts for Sneha
    const p1 = await Post.create({
      userId: sneha.id,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
      caption: 'Found the most amazing pizza place today! 🍕 Highly recommend!',
      location: 'Pizza Paradise, Hyderabad',
      restaurant: 'Pizza Paradise',
      rating: 5
    });

    const p2 = await Post.create({
      userId: sneha.id,
      imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
      caption: 'Late night dessert cravings satisfied! 🍩🍰',
      location: 'Sweet Sensations',
      restaurant: 'Sweet Sensations',
      rating: 4
    });

    console.log('Created posts for Sneha');

    // 2. Add some followers for Sneha
    if (otherUsers.length > 0) {
      await Follow.create({ followerId: otherUsers[0].id, followingId: sneha.id });
      await Follow.create({ followerId: otherUsers[1].id, followingId: sneha.id });
      console.log('Added followers to Sneha');

      // Add likes to her posts
      await Like.create({ userId: otherUsers[0].id, postId: p1.id });
      await Like.create({ userId: otherUsers[1].id, postId: p1.id });
      await Like.create({ userId: otherUsers[0].id, postId: p2.id });
    }

    console.log('Successfully seeded data for Sneha!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

seedSneha();
