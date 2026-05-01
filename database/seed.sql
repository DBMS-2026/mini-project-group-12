-- ============================================================
-- Crave Food Seed Data
-- Run after schema.sql to populate the database
-- ============================================================

USE food_creed;

-- ============================================================
-- 1. USERS (password is 'password123' hashed with bcrypt)
-- ============================================================
INSERT INTO users (fullName, username, email, phone, password, bio, avatar) VALUES
('Shankar Foodie', 'shankar_foodie', 'shankar@gmail.com', '+91 9876543210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Food blogger 🍔 | Exploring cafes and restaurants', ''),
('Pizza Lover', 'pizza_lover', 'pizza@gmail.com', '+91 9876543211', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pizza enthusiast 🍕 | Cheese is life', ''),
('Sweet Tooth', 'sweet_tooth', 'sweet@gmail.com', '+91 9876543212', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dessert hunter 🧇 | Sweet cravings always', ''),
('Burger King Fan', 'burger_lover', 'burger@gmail.com', '+91 9876543213', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Burger addict 🍔 | Fast food reviewer', ''),
('Street Foodie', 'street_foodie', 'street@gmail.com', '+91 9876543214', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Street food explorer 🌮 | Local flavors only', '');

-- ============================================================
-- 2. RESTAURANTS
-- ============================================================
INSERT INTO restaurants (name, location, cuisine, description, rating, openingTime, phone, mapLink, imageUrl) VALUES
('Burger King', 'Hyderabad, India', 'Fast Food, Burgers, Fries', 'One of the most popular places for burgers, fries, shakes and spicy fast food items.', 4.7, '10:00 AM - 11:00 PM', '+91 9876543210', 'https://maps.google.com/?q=Burger+King+Hyderabad', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'),
('Dominos', 'Hyderabad, India', 'Pizza, Italian, Fast Food', 'Famous for their cheesy pizzas and fast delivery.', 4.5, '11:00 AM - 11:00 PM', '+91 9876543211', 'https://maps.google.com/?q=Dominos+Hyderabad', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'),
('Belgian Waffle', 'Hyderabad, India', 'Desserts, Waffles, Beverages', 'Premium waffle destination with creative toppings and flavors.', 4.8, '10:00 AM - 10:00 PM', '+91 9876543212', 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800'),
('Pizza Hut', 'Hyderabad, India', 'Pizza, Italian, Pasta', 'Classic pizza chain known for pan pizzas and garlic bread.', 4.3, '11:00 AM - 11:00 PM', '+91 9876543213', 'https://maps.google.com/?q=Pizza+Hut+Hyderabad', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'),
('Paradise Biryani', 'Hyderabad, India', 'Biryani, Mughlai, Indian', 'Legendary Hyderabadi biryani — a must-visit for biryani lovers.', 4.9, '11:00 AM - 11:30 PM', '+91 9876543214', 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800');

-- ============================================================
-- 3. POSTS (food images)
-- ============================================================
INSERT INTO posts (userId, caption, imageUrl, videoUrl, restaurant, mapLink, type) VALUES
(1, 'Best burger ever 🍔 The patty was perfectly grilled!', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', NULL, 'Burger King', 'https://maps.google.com/?q=Burger+King+Hyderabad', 'post'),
(2, 'Cheesy overloaded pizza 🍕 Absolutely divine!', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', NULL, 'Dominos', 'https://maps.google.com/?q=Dominos+Hyderabad', 'post'),
(3, 'Chocolate waffle heaven 🧇 Sweet paradise!', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800', NULL, 'Belgian Waffle', 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', 'post'),
(4, 'Spicy chicken burger 🌶️🍔 Fire in every bite!', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', NULL, 'Burger King', 'https://maps.google.com/?q=Burger+King+Hyderabad', 'post'),
(5, 'Hyderabadi biryani — nothing beats this! 🍗', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', NULL, 'Paradise Biryani', 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', 'post'),
(1, 'Morning coffee and donuts ☕🍩', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', NULL, 'Starbucks', 'https://maps.google.com/?q=Starbucks+Hyderabad', 'post');

-- ============================================================
-- 4. REELS (food videos with working Pixabay URLs)
-- ============================================================
INSERT INTO posts (userId, caption, imageUrl, videoUrl, restaurant, mapLink, type) VALUES
(2, 'Cheese pull reel 🧀🍕 Look at that stretch!', NULL, 'https://cdn.pixabay.com/video/2021/06/30/79635-570129414_large.mp4', 'Dominos', 'https://maps.google.com/?q=Dominos+Hyderabad', 'reel'),
(4, 'Burger making process 🍔🔥 Perfection on a bun!', NULL, 'https://cdn.pixabay.com/video/2022/09/25/132533-753956291_large.mp4', 'Burger King', 'https://maps.google.com/?q=Burger+King+Hyderabad', 'reel'),
(5, 'Biryani cooking reel 🍗🔥 Authentic Hyderabadi!', NULL, 'https://cdn.pixabay.com/video/2022/09/13/131186-750216606_large.mp4', 'Paradise Biryani', 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', 'reel'),
(1, 'Sizzling BBQ burger patty 🔥🍔 Hear that sizzle!', NULL, 'https://cdn.pixabay.com/video/2022/07/20/124823-732633111_large.mp4', 'Burger King', 'https://maps.google.com/?q=Burger+King+Hyderabad', 'reel'),
(2, 'Pepperoni pizza straight from the oven 🍕🤤', NULL, 'https://cdn.pixabay.com/video/2022/09/25/132538-753956329_large.mp4', 'Dominos', 'https://maps.google.com/?q=Dominos+Hyderabad', 'reel'),
(3, 'Pouring maple syrup on hot waffles 🧇🍯', NULL, 'https://cdn.pixabay.com/video/2016/07/22/3953-175860893_large.mp4', 'Belgian Waffle', 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', 'reel'),
(4, 'Pizza baking in a wood-fired oven 🍕🔥', NULL, 'https://cdn.pixabay.com/video/2018/07/08/17177-278954650_large.mp4', 'Pizza Hut', 'https://maps.google.com/?q=Pizza+Hut+Hyderabad', 'reel'),
(5, 'Street food vibes 🌮🔥 Flavors you can taste through the screen!', NULL, 'https://cdn.pixabay.com/video/2023/02/15/150758-798983885_large.mp4', 'Paradise Biryani', 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', 'reel'),
(1, 'Crispy golden fries 🍟 Perfectly salted!', NULL, 'https://cdn.pixabay.com/video/2021/04/24/72025-543403489_large.mp4', 'Burger King', 'https://maps.google.com/?q=Burger+King+Hyderabad', 'reel'),
(2, 'Latte art coffee magic ☕🎨', NULL, 'https://cdn.pixabay.com/video/2024/09/24/233024_large.mp4', 'Starbucks', 'https://maps.google.com/?q=Starbucks+Hyderabad', 'reel'),
(3, 'Sweet pastry dessert vibes 🍰✨', NULL, 'https://cdn.pixabay.com/video/2023/04/17/159429-818832307_large.mp4', 'Belgian Waffle', 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', 'reel'),
(4, 'The ultimate hamburger experience 🍔🤤', NULL, 'https://cdn.pixabay.com/video/2022/04/20/114540-701775812_large.mp4', 'Burger King', 'https://maps.google.com/?q=Burger+King+Hyderabad', 'reel'),
(5, 'Street food adventure 🌮🔥 Local flavors only!', NULL, 'https://cdn.pixabay.com/video/2020/02/05/31970-389724727_large.mp4', 'Paradise Biryani', 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', 'reel'),
(1, 'Chocolate cupcake perfection 🧁🍫', NULL, 'https://cdn.pixabay.com/video/2024/05/31/214655_large.mp4', 'Belgian Waffle', 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', 'reel'),
(2, 'Coffee beans roasting ☕🫘 Smells incredible!', NULL, 'https://cdn.pixabay.com/video/2022/08/05/126804-737028143_large.mp4', 'Starbucks', 'https://maps.google.com/?q=Starbucks+Hyderabad', 'reel'),
(3, 'Belgian street waffles 🧇 Fresh and warm!', NULL, 'https://cdn.pixabay.com/video/2016/07/22/3952-175860892_large.mp4', 'Belgian Waffle', 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', 'reel'),
(4, 'Ice cream on a hot day 🍦☀️', NULL, 'https://cdn.pixabay.com/video/2025/11/04/311635_large.mp4', 'Belgian Waffle', 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', 'reel'),
(5, 'Stir-fried noodles magic 🍜🔥', NULL, 'https://cdn.pixabay.com/video/2017/08/30/11716-231759045_large.mp4', 'Paradise Biryani', 'https://maps.google.com/?q=Paradise+Biryani+Hyderabad', 'reel'),
(1, 'Birthday cake celebration 🎂🎉', NULL, 'https://cdn.pixabay.com/video/2021/09/21/89246-613200544_large.mp4', 'Belgian Waffle', 'https://maps.google.com/?q=Belgian+Waffle+Hyderabad', 'reel'),
(2, 'Fresh orange juice splash 🍊🥤', NULL, 'https://cdn.pixabay.com/video/2016/06/22/3482-171249620_large.mp4', 'Starbucks', 'https://maps.google.com/?q=Starbucks+Hyderabad', 'reel');

-- ============================================================
-- 5. COMMENTS
-- ============================================================
INSERT INTO comments (postId, userId, text) VALUES
(1, 2, 'Looks amazing! 🤤'),
(1, 3, 'I need to try this place!'),
(2, 1, 'That cheese pull though! 🧀'),
(2, 4, 'Dominos never disappoints 🍕'),
(3, 5, 'Waffle goals! 🧇'),
(4, 1, 'The spice level is perfect 🌶️'),
(5, 2, 'Hyderabad biryani is the best! 🍗');

-- ============================================================
-- 6. LIKES (M:N junction — user can like each post once)
-- ============================================================
INSERT INTO likes (postId, userId) VALUES
(1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 3), (2, 5),
(3, 1), (3, 2), (3, 4), (3, 5),
(4, 2), (4, 3),
(5, 1), (5, 2), (5, 3), (5, 4);

-- ============================================================
-- 7. SAVED POSTS (M:N junction — bookmarks)
-- ============================================================
INSERT INTO saved_posts (postId, userId) VALUES
(1, 2), (2, 1), (3, 1), (5, 2), (4, 5);

-- ============================================================
-- 8. FOLLOWERS (self-referencing M:N — social graph)
-- ============================================================
INSERT INTO followers (followerId, followingId) VALUES
(1, 2), (1, 3),
(2, 1), (3, 1),
(4, 1), (5, 1),
(2, 4), (3, 5);

-- ============================================================
-- 9. MENU ITEMS
-- ============================================================
INSERT INTO menu_items (restaurantId, name, description, price, imageUrl, isVeg) VALUES
(1, 'Whopper Burger', 'Signature flame-grilled beef/veg patty with fresh tomatoes and lettuce.', 149.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', FALSE),
(1, 'Crispy Veg Burger', 'Crunchy veg patty with creamy mayo.', 79.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', TRUE),
(1, 'French Fries', 'Crispy golden fries salted to perfection.', 99.00, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800', TRUE),
(2, 'Margherita Pizza', 'Classic delight with 100% real mozzarella cheese.', 199.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800', TRUE),
(2, 'Pepperoni Pizza', 'American classic with spicy pepperoni slices.', 349.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800', FALSE),
(2, 'Garlic Bread', 'Freshly baked garlic bread sticks.', 129.00, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800', TRUE),
(3, 'Nutella Waffle', 'Classic Belgian waffle loaded with Nutella.', 159.00, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800', TRUE),
(3, 'Berry Blast Waffle', 'Waffle topped with fresh berries and cream.', 179.00, 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800', TRUE),
(4, 'Farmhouse Pizza', 'Loaded with fresh veggies and cheese.', 299.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', TRUE),
(5, 'Chicken Dum Biryani', 'Authentic Hyderabadi biryani cooked on dum.', 320.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', FALSE),
(5, 'Mutton Biryani', 'Premium biryani with tender mutton pieces.', 450.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', FALSE),
(5, 'Paneer 65', 'Spicy, deep-fried paneer appetizer.', 220.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', TRUE);

-- SELECT u.fullName, COUNT(f.id) as follower_count FROM users u LEFT JOIN followers f ON u.id = f.followingId GROUP BY u.id ORDER BY follower_count DESC;
-- SELECT u.fullName, COUNT(s.id) as saved_count FROM users u JOIN saved_posts s ON u.id = s.userId GROUP BY u.id;
