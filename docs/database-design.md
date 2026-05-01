# Database Design

## Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | Primary Key |
| fullName | VARCHAR(100) | NOT NULL |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| phone | VARCHAR(20) | Optional |
| password | VARCHAR(255) | NULL for Google OAuth |
| bio | TEXT | Default empty |
| avatar | VARCHAR(500) | Default empty |
| googleId | VARCHAR(100) | UNIQUE, for OAuth |

### posts
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | Primary Key |
| userId | INT | FK -> users(id) |
| caption | TEXT | Optional |
| imageUrl | VARCHAR(500) | For image posts |
| videoUrl | VARCHAR(500) | For video/reels |
| restaurant | VARCHAR(200) | Restaurant name |
| mapLink | VARCHAR(500) | Google Maps link |
| type | ENUM('post','reel') | Default 'post' |

### comments
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | Primary Key |
| postId | INT | FK -> posts(id) |
| userId | INT | FK -> users(id) |
| text | TEXT | NOT NULL |

### likes
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | Primary Key |
| postId | INT | FK -> posts(id) |
| userId | INT | FK -> users(id) |
| UNIQUE | (postId, userId) | Prevent double likes |

### saved_posts
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | Primary Key |
| postId | INT | FK -> posts(id) |
| userId | INT | FK -> users(id) |
| UNIQUE | (postId, userId) | Prevent double saves |

### restaurants
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | Primary Key |
| name | VARCHAR(200) | NOT NULL |
| location | VARCHAR(300) | |
| cuisine | VARCHAR(300) | |
| description | TEXT | |
| rating | DECIMAL(3,1) | |
| openingTime | VARCHAR(100) | |
| phone | VARCHAR(20) | |
| mapLink | VARCHAR(500) | |
| imageUrl | VARCHAR(500) | |

## Relationships
- User (1) -> (N) Posts
- User (1) -> (N) Comments
- Post (1) -> (N) Comments
- Post (1) -> (N) Likes
- User (1) -> (N) Likes
- Post (1) -> (N) SavedPosts
- User (1) -> (N) SavedPosts
