const { connectDB } = require('./src/config/db');
const { sequelize, User, Post, Comment, Like, SavedPost, Restaurant, Follower, MenuItem, Order } = require('./src/models');
const hashPassword = require('./src/utils/hashPassword');

const seedDatabase = async () => {
  try {
    await connectDB();
    await sequelize.sync({ force: true });
    
    console.log('🌱 Seeding database...');

    const hashedPw = await hashPassword('password123');

    await User.bulkCreate([
      { fullName: 'Sneha Maddineni', username: 'Maddineni', email: 'sneha@example.com', phone: '+91 9000000000', password: hashedPw, bio: 'Food explorer 🍕' },
      { fullName: 'Shankar Foodie', username: 'shankar_foodie', email: 'shankar@gmail.com', phone: '+91 9876543210', password: hashedPw, bio: 'Food blogger 🍔 | Exploring cafes and restaurants' },
      { fullName: 'Pizza Lover', username: 'pizza_lover', email: 'pizza@gmail.com', phone: '+91 9876543211', password: hashedPw, bio: 'Pizza enthusiast 🍕 | Cheese is life' },
      { fullName: 'Sweet Tooth', username: 'sweet_tooth', email: 'sweet@gmail.com', phone: '+91 9876543212', password: hashedPw, bio: 'Dessert hunter 🧇 | Sweet cravings always' },
      { fullName: 'Burger King Fan', username: 'burger_lover', email: 'burger@gmail.com', phone: '+91 9876543213', password: hashedPw, bio: 'Burger addict 🍔 | Fast food reviewer' },
      { fullName: 'Street Foodie', username: 'street_foodie', email: 'street@gmail.com', phone: '+91 9876543214', password: hashedPw, bio: 'Street food explorer 🌮 | Local flavors only' },
    ]);
    const users = await User.findAll({ order: [['id', 'ASC']] });

    await Restaurant.bulkCreate([
      { name: 'Burger King', location: 'Hyderabad, India', cuisine: 'Fast Food, Burgers, Fries', description: 'One of the most popular places for burgers, fries, shakes and spicy fast food items.', rating: 4.7, openingTime: '10:00 AM - 11:00 PM', phone: '+91 9876543210', mapLink: 'https://maps.google.com/?q=Burger+King+Hyderabad', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800' },
      { name: 'Dominos', location: 'Hyderabad, India', cuisine: 'Pizza, Italian, Fast Food', description: 'Famous for their cheesy pizzas and fast delivery.', rating: 4.5, openingTime: '11:00 AM - 11:00 PM', phone: '+91 9876543211', mapLink: 'https://maps.google.com/?q=Dominos+Hyderabad', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800' },
      { name: 'Belgian Waffle', location: 'Hyderabad, India', cuisine: 'Desserts, Waffles, Beverages', description: 'Premium waffle destination with creative toppings.', rating: 4.8, openingTime: '10:00 AM - 10:00 PM', phone: '+91 9876543212', mapLink: 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800' },
      { name: 'Pizza Hut', location: 'Hyderabad, India', cuisine: 'Pizza, Italian, Pasta', description: 'Classic pizza chain known for pan pizzas.', rating: 4.3, openingTime: '11:00 AM - 11:00 PM', phone: '+91 9876543213', mapLink: 'https://maps.google.com/?q=Pizza+Hut+Hyderabad', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800' },
      { name: 'Paradise Biryani', location: 'Hyderabad, India', cuisine: 'Biryani, Mughlai, Indian', description: 'Legendary Hyderabadi biryani.', rating: 4.9, openingTime: '11:00 AM - 11:30 PM', phone: '+91 9876543214', mapLink: 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800' },
    ]);

    await MenuItem.bulkCreate([
      { restaurantId: 1, name: 'Whopper Burger', description: 'Signature flame-grilled beef/veg patty with fresh tomatoes and lettuce.', price: 149.00, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', isVeg: false },
      { restaurantId: 1, name: 'Crispy Veg Burger', description: 'Crunchy veg patty with creamy mayo.', price: 79.00, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', isVeg: true },
      { restaurantId: 1, name: 'French Fries', description: 'Crispy golden fries salted to perfection.', price: 99.00, imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800', isVeg: true },

      { restaurantId: 2, name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese.', price: 199.00, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800', isVeg: true },
      { restaurantId: 2, name: 'Pepperoni Pizza', description: 'American classic with spicy pepperoni slices.', price: 349.00, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800', isVeg: false },
      { restaurantId: 2, name: 'Garlic Bread', description: 'Freshly baked garlic bread sticks.', price: 129.00, imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800', isVeg: true },

      { restaurantId: 3, name: 'Nutella Waffle', description: 'Classic Belgian waffle loaded with Nutella.', price: 159.00, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800', isVeg: true },
      { restaurantId: 3, name: 'Berry Blast Waffle', description: 'Waffle topped with fresh berries and cream.', price: 179.00, imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800', isVeg: true },

      { restaurantId: 4, name: 'Farmhouse Pizza', description: 'Loaded with fresh veggies and cheese.', price: 299.00, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', isVeg: true },

      { restaurantId: 5, name: 'Chicken Dum Biryani', description: 'Authentic Hyderabadi biryani cooked on dum.', price: 320.00, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', isVeg: false },
      { restaurantId: 5, name: 'Mutton Biryani', description: 'Premium biryani with tender mutton pieces.', price: 450.00, imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', isVeg: false },
      { restaurantId: 5, name: 'Paneer 65', description: 'Spicy, deep-fried paneer appetizer.', price: 220.00, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', isVeg: true },
    ]);

    const posts = await Post.bulkCreate([
      { userId: users[0].id, caption: 'Best burger ever 🍔 The patty was perfectly grilled!', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', restaurant: 'Burger King', mapLink: 'https://maps.google.com/?q=Burger+King+Hyderabad', type: 'post' },
      { userId: users[1].id, caption: 'Cheesy overloaded pizza 🍕 Absolutely divine!', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', restaurant: 'Dominos', mapLink: 'https://maps.google.com/?q=Dominos+Hyderabad', type: 'post' },
      { userId: users[2].id, caption: 'Chocolate waffle heaven 🧇 Sweet paradise!', imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800', restaurant: 'Belgian Waffle', mapLink: 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', type: 'post' },
      { userId: users[3].id, caption: 'Spicy chicken burger 🌶️🍔 Fire in every bite!', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', restaurant: 'Burger King', mapLink: 'https://maps.google.com/?q=Burger+King+Hyderabad', type: 'post' },
      { userId: users[4].id, caption: 'Hyderabadi biryani — nothing beats this! 🍗', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', restaurant: 'Paradise Biryani', mapLink: 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', type: 'post' },
      { userId: users[0].id, caption: 'Morning coffee and donuts ☕🍩', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', restaurant: 'Starbucks', type: 'post' },
      // Reels (food videos)
      { userId: users[1].id, caption: 'Cheese pull reel 🧀🍕', videoUrl: 'https://videos.pexels.com/video-files/3195440/3195440-uhd_2560_1440_25fps.mp4', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', restaurant: 'Dominos', mapLink: 'https://maps.google.com/?q=Dominos+Hyderabad', type: 'reel' },
      { userId: users[3].id, caption: 'Burger making process 🍔🔥', videoUrl: 'https://videos.pexels.com/video-files/3298208/3298208-uhd_2560_1440_30fps.mp4', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', restaurant: 'Burger King', mapLink: 'https://maps.google.com/?q=Burger+King+Hyderabad', type: 'reel' },
      { userId: users[4].id, caption: 'Biryani cooking reel 🍗🔥', videoUrl: 'https://videos.pexels.com/video-files/5501968/5501968-uhd_2560_1440_24fps.mp4', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', restaurant: 'Paradise Biryani', mapLink: 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', type: 'reel' },
    ]);

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

    // Seed follower relationships
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

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('⚠️  Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
