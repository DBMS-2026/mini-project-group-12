-- ============================================================
-- Crave Food — Academic DBMS Queries
-- Demonstrates JOIN, GROUP BY, HAVING, subqueries,
-- aggregation, and normalization concepts
-- ============================================================

USE food_creed;

-- ============================================================
-- QUERY 1: Get all posts with user info and engagement metrics
-- Demonstrates: INNER JOIN, COUNT, GROUP BY, ORDER BY
-- ============================================================
SELECT 
  p.id AS post_id,
  u.fullName AS author,
  p.caption,
  p.type,
  COUNT(DISTINCT l.id) AS like_count,
  COUNT(DISTINCT c.id) AS comment_count,
  p.createdAt
FROM posts p
INNER JOIN users u ON p.userId = u.id
LEFT JOIN likes l ON p.id = l.postId
LEFT JOIN comments c ON p.id = c.postId
GROUP BY p.id
ORDER BY like_count DESC;

-- ============================================================
-- QUERY 2: Most popular users by follower count
-- Demonstrates: LEFT JOIN, GROUP BY, COUNT, ORDER BY DESC
-- ============================================================
SELECT 
  u.fullName,
  u.username,
  COUNT(f.id) AS follower_count
FROM users u
LEFT JOIN followers f ON u.id = f.followingId
GROUP BY u.id
ORDER BY follower_count DESC;

-- ============================================================
-- QUERY 3: Users who liked AND commented on the same post
-- Demonstrates: INNER JOIN on multiple tables, INTERSECT logic
-- ============================================================
SELECT DISTINCT
  u.fullName,
  p.caption AS post_caption
FROM users u
INNER JOIN likes l ON u.id = l.userId
INNER JOIN comments c ON u.id = c.userId AND l.postId = c.postId
INNER JOIN posts p ON p.id = l.postId;

-- ============================================================
-- QUERY 4: Restaurant ranking by total post engagement
-- Demonstrates: GROUP BY, SUM with subquery, HAVING
-- ============================================================
SELECT 
  p.restaurant,
  COUNT(DISTINCT p.id) AS total_posts,
  COUNT(DISTINCT l.id) AS total_likes,
  COUNT(DISTINCT c.id) AS total_comments,
  (COUNT(DISTINCT l.id) + COUNT(DISTINCT c.id)) AS total_engagement
FROM posts p
LEFT JOIN likes l ON p.id = l.postId
LEFT JOIN comments c ON p.id = c.postId
WHERE p.restaurant IS NOT NULL
GROUP BY p.restaurant
HAVING total_engagement > 0
ORDER BY total_engagement DESC;

-- ============================================================
-- QUERY 5: Mutual followers (users who follow each other)
-- Demonstrates: Self-JOIN on the same table
-- ============================================================
SELECT 
  u1.fullName AS user_a,
  u2.fullName AS user_b
FROM followers f1
INNER JOIN followers f2 ON f1.followerId = f2.followingId 
  AND f1.followingId = f2.followerId
INNER JOIN users u1 ON f1.followerId = u1.id
INNER JOIN users u2 ON f1.followingId = u2.id
WHERE f1.followerId < f1.followingId;

-- ============================================================
-- QUERY 6: Users who have never posted
-- Demonstrates: LEFT JOIN with IS NULL check (anti-join)
-- ============================================================
SELECT u.fullName, u.username
FROM users u
LEFT JOIN posts p ON u.id = p.userId
WHERE p.id IS NULL;

-- ============================================================
-- QUERY 7: Average likes per post by user
-- Demonstrates: Subquery, AVG aggregation
-- ============================================================
SELECT 
  u.fullName,
  u.username,
  ROUND(AVG(like_counts.cnt), 1) AS avg_likes_per_post
FROM users u
INNER JOIN (
  SELECT p.userId, p.id, COUNT(l.id) AS cnt
  FROM posts p
  LEFT JOIN likes l ON p.id = l.postId
  GROUP BY p.id
) AS like_counts ON u.id = like_counts.userId
GROUP BY u.id
ORDER BY avg_likes_per_post DESC;

-- ============================================================
-- QUERY 8: Posts saved by the most users
-- Demonstrates: GROUP BY, COUNT, ORDER BY, LIMIT
-- ============================================================
SELECT 
  p.caption,
  u.fullName AS author,
  COUNT(sp.id) AS save_count
FROM posts p
INNER JOIN users u ON p.userId = u.id
LEFT JOIN saved_posts sp ON p.id = sp.postId
GROUP BY p.id
HAVING save_count > 0
ORDER BY save_count DESC
LIMIT 5;
