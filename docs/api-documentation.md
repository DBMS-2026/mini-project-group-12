# Crave Food API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/signup
Create a new account.
- **Body**: `{ fullName, username, email, phone, password }`
- **Response**: `{ success, data: { user, token } }`

### POST /auth/login
Login with email and password.
- **Body**: `{ email, password }`
- **Response**: `{ success, data: { user, token } }`

### GET /auth/me 🔒
Get current user profile.
- **Response**: `{ success, data: { user } }`

### GET /auth/google
Redirect to Google OAuth login.

---

## Post Endpoints

### GET /posts
Get all posts (feed). Supports pagination.
- **Query**: `?page=1&limit=10`

### POST /posts 🔒
Create a new post.
- **Body**: `{ caption, imageUrl, videoUrl, restaurant, mapLink, type }`

### GET /posts/:id
Get single post with comments and likes.

### DELETE /posts/:id 🔒
Delete own post.

### GET /posts/reels
Get all reels.

### GET /posts/user/:username
Get all posts by a user.

---

## Comment Endpoints

### POST /comments/:postId 🔒
Add a comment.
- **Body**: `{ text }`

### GET /comments/:postId
Get all comments for a post.

### DELETE /comments/:id 🔒
Delete own comment.

---

## Like Endpoints

### POST /likes/:postId/toggle 🔒
Toggle like on a post.

### GET /likes/:postId 🔒
Get like count and status.

---

## Follow Endpoints

### POST /follows/:userId/toggle 🔒
Toggle follow on a user.

### GET /follows/:userId/status 🔒
Get follow status.

### GET /follows/:userId/followers
Get user's followers.

### GET /follows/:userId/following
Get user's following list.

---

## Save Endpoints

### POST /saves/:postId/toggle 🔒
Toggle save on a post.

### GET /saves 🔒
Get all saved posts.

### GET /saves/:postId/check 🔒
Check if post is saved.

---

## Upload Endpoints

### POST /upload/image 🔒
Upload an image to Cloudinary.
- **Body**: multipart/form-data with `image` field

### POST /upload/video 🔒
Upload a video to Cloudinary.
- **Body**: multipart/form-data with `video` field

---

## User Endpoints

### GET /users/:username
Get user profile.

### PUT /users/profile 🔒
Update own profile.
- **Body**: `{ fullName, username, phone, bio }`

### GET /users/search?q=query 🔒
Search users by name or username.

---

## Restaurant Endpoints

### GET /restaurants
Get all restaurants. Optional search: `?q=query`

### GET /restaurants/:name
Get single restaurant by name.

### GET /restaurants/:name/posts
Get all posts for a restaurant.
