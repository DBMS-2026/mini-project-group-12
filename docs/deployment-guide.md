# Deployment Guide

## Prerequisites
- Node.js 18+
- MySQL 8+
- Cloudinary account
- Google Cloud Console (for OAuth)

## Production Deployment

### 1. Database
- Create MySQL database on your hosting provider
- Run schema.sql and seed.sql

### 2. Backend
- Set environment variables (PORT, DB credentials, JWT_SECRET, Cloudinary, Google OAuth)
- `npm install --production`
- `npm start`
- Use PM2 for process management: `pm2 start src/server.js --name crave-food-api`

### 3. Frontend
- Update `.env` with production API URL
- `npm run build`
- Serve the `dist/` folder with Nginx or any static host

### 4. Recommended Hosting
- **Backend**: Railway, Render, AWS EC2, DigitalOcean
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: PlanetScale, AWS RDS, Railway MySQL
