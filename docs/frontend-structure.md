# Frontend Structure

## Pages
- `/` - Login page
- `/signup` - Signup page
- `/home` - Feed with food posts
- `/reels` - Food reels
- `/upload` - Upload new post/reel
- `/saved` - Saved posts
- `/search` - Search users & restaurants
- `/profile` - Own profile
- `/profile/:username` - User profile
- `/restaurant` - Restaurant listing
- `/restaurant/:name` - Restaurant detail
- `/notifications` - Notifications
- `/settings` - Settings

## Component Tree
```
App
├── AuthProvider
│   ├── NotificationProvider
│   │   └── AppRoutes
│   │       ├── Login (public)
│   │       ├── Signup (public)
│   │       └── ProtectedRoute
│   │           ├── MainLayout
│   │           │   ├── Sidebar
│   │           │   ├── Navbar
│   │           │   ├── Content (children)
│   │           │   └── RightSidebar
│   │           ├── Home (PostCard list)
│   │           ├── Reels (ReelCard list)
│   │           ├── Upload (UploadForm)
│   │           ├── Profile (ProfileHeader, UserPosts)
│   │           └── Restaurant (RestaurantInfo, RestaurantPosts)
```
