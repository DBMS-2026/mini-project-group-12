-- ============================================================
-- Crave Food Database Schema
-- DBMS: MySQL 8.x
-- Description: Social media platform for food lovers
-- Normalized schema with proper constraints
-- ============================================================

CREATE DATABASE IF NOT EXISTS food_creed
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE food_creed;

-- ============================================================
-- 1. USERS TABLE
-- Primary entity: stores user credentials and profile info
-- Normalization: 3NF — no transitive dependencies
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  fullName        VARCHAR(100)    NOT NULL,
  username        VARCHAR(50)     NOT NULL,
  email           VARCHAR(100)    NOT NULL,
  phone           VARCHAR(20)     DEFAULT '',
  password        VARCHAR(255)    NOT NULL,
  bio             TEXT            DEFAULT '',
  avatar          VARCHAR(500)    DEFAULT '',
  createdAt       DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Unique constraints for business rules
  UNIQUE KEY uq_username (username),
  UNIQUE KEY uq_email (email),

  -- Indexes for fast lookups
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- 2. POSTS TABLE
-- Stores food posts and reels with media URLs
-- FK: userId -> users(id) CASCADE
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  userId          INT             NOT NULL,
  caption         TEXT,
  imageUrl        VARCHAR(500),
  videoUrl        VARCHAR(500),
  restaurant      VARCHAR(200),
  mapLink         VARCHAR(500),
  type            ENUM('post', 'reel') DEFAULT 'post',
  createdAt       DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign key with referential integrity
  CONSTRAINT fk_posts_user FOREIGN KEY (userId)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,

  -- Indexes
  INDEX idx_posts_userId (userId),
  INDEX idx_posts_type (type),
  INDEX idx_posts_created (createdAt DESC)
) ENGINE=InnoDB;

-- ============================================================
-- 3. COMMENTS TABLE
-- M:1 relationship with both posts and users
-- FK: postId -> posts(id) CASCADE, userId -> users(id) CASCADE
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  postId          INT             NOT NULL,
  userId          INT             NOT NULL,
  text            TEXT            NOT NULL,
  createdAt       DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_comments_post FOREIGN KEY (postId)
    REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (userId)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_comments_postId (postId),
  INDEX idx_comments_userId (userId)
) ENGINE=InnoDB;

-- ============================================================
-- 4. LIKES TABLE (Junction table — M:N between users and posts)
-- Unique constraint prevents duplicate likes
-- FK: postId -> posts(id) CASCADE, userId -> users(id) CASCADE
-- ============================================================
CREATE TABLE IF NOT EXISTS likes (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  postId          INT             NOT NULL,
  userId          INT             NOT NULL,
  createdAt       DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Business rule: a user can only like a post once
  UNIQUE KEY uq_like (postId, userId),

  CONSTRAINT fk_likes_post FOREIGN KEY (postId)
    REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_likes_user FOREIGN KEY (userId)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_likes_postId (postId),
  INDEX idx_likes_userId (userId)
) ENGINE=InnoDB;

-- ============================================================
-- 5. SAVED_POSTS TABLE (Junction table — M:N between users and posts)
-- Bookmarking system with unique constraint
-- FK: postId -> posts(id) CASCADE, userId -> users(id) CASCADE
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_posts (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  postId          INT             NOT NULL,
  userId          INT             NOT NULL,
  createdAt       DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Business rule: a user can save a post only once
  UNIQUE KEY uq_save (postId, userId),

  CONSTRAINT fk_saved_post FOREIGN KEY (postId)
    REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_saved_user FOREIGN KEY (userId)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_saved_postId (postId),
  INDEX idx_saved_userId (userId)
) ENGINE=InnoDB;

-- ============================================================
-- 6. FOLLOWERS TABLE (Self-referencing M:N on users)
-- Implements follow/unfollow social graph
-- followerId follows followingId
-- FK: both reference users(id) CASCADE
-- ============================================================
CREATE TABLE IF NOT EXISTS followers (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  followerId      INT             NOT NULL COMMENT 'User who is following',
  followingId     INT             NOT NULL COMMENT 'User who is being followed',
  createdAt       DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Business rule: cannot follow the same person twice
  UNIQUE KEY uq_follow (followerId, followingId),

  CONSTRAINT fk_follower_user FOREIGN KEY (followerId)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_following_user FOREIGN KEY (followingId)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_followerId (followerId),
  INDEX idx_followingId (followingId)
) ENGINE=InnoDB;

-- ============================================================
-- 7. RESTAURANTS TABLE
-- Stores restaurant information for location tagging
-- Independent entity — no foreign keys (referenced by name in posts)
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(200)    NOT NULL,
  location        VARCHAR(300),
  cuisine         VARCHAR(300),
  description     TEXT,
  rating          DECIMAL(3,1)    DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
  openingTime     VARCHAR(100),
  phone           VARCHAR(20),
  mapLink         VARCHAR(500),
  imageUrl        VARCHAR(500),
  createdAt       DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_restaurant_name (name),
  INDEX idx_restaurant_rating (rating DESC)
) ENGINE=InnoDB;

-- ============================================================
-- ER DIAGRAM RELATIONSHIPS SUMMARY
-- ============================================================
-- users (1) ---< (M) posts          : One user has many posts
-- users (1) ---< (M) comments       : One user has many comments
-- posts (1) ---< (M) comments       : One post has many comments
-- users (M) >---< (M) posts [likes] : Many-to-Many via likes junction
-- users (M) >---< (M) posts [saved] : Many-to-Many via saved_posts junction
-- users (M) >---< (M) users [follow]: Self-referencing M:N via followers
-- ============================================================

-- ============================================================
-- 8. MENU_ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  restaurantId    INT             NOT NULL,
  name            VARCHAR(200)    NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2)   NOT NULL,
  imageUrl        VARCHAR(500),
  isVeg           BOOLEAN         DEFAULT TRUE,
  createdAt       DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_menu_restaurant FOREIGN KEY (restaurantId)
    REFERENCES restaurants(id) ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_menu_restaurant (restaurantId)
) ENGINE=InnoDB;

-- ============================================================
-- 9. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  userId            INT             NOT NULL,
  restaurantId      INT             NOT NULL,
  totalAmount       DECIMAL(10,2)   NOT NULL,
  status            ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  razorpayOrderId   VARCHAR(100),
  razorpayPaymentId VARCHAR(100),
  items             JSON,
  createdAt         DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updatedAt         DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_orders_user FOREIGN KEY (userId)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_orders_restaurant FOREIGN KEY (restaurantId)
    REFERENCES restaurants(id) ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_orders_user (userId),
  INDEX idx_orders_restaurant (restaurantId)
) ENGINE=InnoDB;
