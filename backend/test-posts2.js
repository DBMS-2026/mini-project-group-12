const { sequelize, User, Post, Comment, Like, SavedPost, Restaurant, Follower } = require('./src/models');
const { connectDB } = require('./src/config/db');

async function test() {
  await connectDB();
  try {
    const users = await User.findAll({ limit: 5 });
    console.log('Users found:', users.map(u => u.id));

    const posts = await Post.bulkCreate([
      { userId: users[0].id, caption: 'Best burger ever 🍔 The patty was perfectly grilled!', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', restaurant: 'Burger King', mapLink: 'https://maps.google.com/?q=Burger+King+Hyderabad', type: 'post' },
      { userId: users[1].id, caption: 'Cheesy overloaded pizza 🍕 Absolutely divine!', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', restaurant: 'Dominos', mapLink: 'https://maps.google.com/?q=Dominos+Hyderabad', type: 'post' },
      { userId: users[2].id, caption: 'Chocolate waffle heaven 🧇 Sweet paradise!', imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800', restaurant: 'Belgian Waffle', mapLink: 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', type: 'post' },
      { userId: users[3].id, caption: 'Spicy chicken burger 🌶️🍔 Fire in every bite!', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', restaurant: 'Burger King', mapLink: 'https://maps.google.com/?q=Burger+King+Hyderabad', type: 'post' },
      { userId: users[4].id, caption: 'Hyderabadi biryani — nothing beats this! 🍗', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', restaurant: 'Paradise Biryani', mapLink: 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', type: 'post' },
      { userId: users[0].id, caption: 'Morning coffee and donuts ☕🍩', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', restaurant: 'Starbucks', type: 'post' },
      { userId: users[1].id, caption: 'Cheese pull reel 🧀🍕', videoUrl: 'https://videos.pexels.com/video-files/3195440/3195440-uhd_2560_1440_25fps.mp4', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', restaurant: 'Dominos', mapLink: 'https://maps.google.com/?q=Dominos+Hyderabad', type: 'reel' },
      { userId: users[3].id, caption: 'Burger making process 🍔🔥', videoUrl: 'https://videos.pexels.com/video-files/3298208/3298208-uhd_2560_1440_30fps.mp4', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', restaurant: 'Burger King', mapLink: 'https://maps.google.com/?q=Burger+King+Hyderabad', type: 'reel' },
      { userId: users[4].id, caption: 'Biryani cooking reel 🍗🔥', videoUrl: 'https://videos.pexels.com/video-files/5501968/5501968-uhd_2560_1440_24fps.mp4', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', restaurant: 'Paradise Biryani', mapLink: 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', type: 'reel' },
    ]);
    console.log('Posts created:', posts.length);

    await Comment.bulkCreate([
      { postId: posts[0].id, userId: users[1].id, text: 'Looks amazing! 🤤' },
      { postId: posts[0].id, userId: users[2].id, text: 'I need to try this place!' },
      { postId: posts[1].id, userId: users[0].id, text: 'That cheese pull though! 🧀' },
      { postId: posts[1].id, userId: users[3].id, text: 'Dominos never disappoints 🍕' },
      { postId: posts[2].id, userId: users[4].id, text: 'Waffle goals! 🧇' },
    ]);

    await Like.bulkCreate([
      { postId: posts[0].id, userId: users[1].id },
      { postId: posts[0].id, userId: users[2].id },
      { postId: posts[0].id, userId: users[3].id },
      { postId: posts[1].id, userId: users[0].id },
      { postId: posts[1].id, userId: users[2].id },
      { postId: posts[2].id, userId: users[0].id },
      { postId: posts[2].id, userId: users[1].id },
      { postId: posts[2].id, userId: users[3].id },
      { postId: posts[3].id, userId: users[1].id },
      { postId: posts[4].id, userId: users[0].id },
      { postId: posts[4].id, userId: users[1].id },
      { postId: posts[4].id, userId: users[2].id },
    ]);

    await SavedPost.bulkCreate([
      { postId: posts[0].id, userId: users[1].id },
      { postId: posts[1].id, userId: users[0].id },
      { postId: posts[2].id, userId: users[0].id },
      { postId: posts[4].id, userId: users[1].id },
    ]);

    await Follower.bulkCreate([
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[0].id, followingId: users[2].id },
      { followerId: users[1].id, followingId: users[0].id },
      { followerId: users[2].id, followingId: users[0].id },
      { followerId: users[3].id, followingId: users[0].id },
      { followerId: users[4].id, followingId: users[0].id },
      { followerId: users[1].id, followingId: users[3].id },
      { followerId: users[2].id, followingId: users[4].id },
    ]);

    console.log('Seeding completed!');
  } catch (error) {
    console.error('Seeding error:', error);
  }
  process.exit(0);
}
test();
