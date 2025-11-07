# Deployment Checklist

This document outlines the steps needed to deploy the LearnSphere application to production.

## Prerequisites

- [ ] MongoDB database (MongoDB Atlas or self-hosted)
- [ ] Cloudinary account for media storage
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (if not using a platform that provides it)

## Environment Variables

### Backend (.env.production)

Ensure all environment variables are set in your production environment:

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env.production)

```
VITE_API_URL=https://yourdomain.com
```

## Deployment Steps

### Option 1: Single Server Deployment (Backend serves Frontend)

1. [ ] Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. [ ] Upload the entire project to your server

3. [ ] Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```

4. [ ] Set environment variables on your server

5. [ ] Start the application:
   ```bash
   npm start
   ```

### Option 2: Separate Deployments (Recommended)

#### Backend Deployment

1. [ ] Deploy backend to a Node.js hosting service (Heroku, DigitalOcean, AWS, etc.)

2. [ ] Set environment variables

3. [ ] Ensure MongoDB and Cloudinary credentials are properly configured

#### Frontend Deployment

1. [ ] Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. [ ] Deploy the `dist` folder to a static hosting service (Vercel, Netlify, etc.)

3. [ ] Configure environment variables

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test course creation as an instructor
- [ ] Test course enrollment as a student
- [ ] Test video playback functionality
- [ ] Test quiz functionality
- [ ] Test real-time messaging
- [ ] Verify all API endpoints are working
- [ ] Check that all environment variables are properly set
- [ ] Ensure proper SSL/HTTPS configuration
- [ ] Set up monitoring and error tracking
- [ ] Configure backup strategies for database and media

## Common Issues and Solutions

### CORS Errors
- Ensure `FRONTEND_URL` is correctly set in backend environment variables
- Check that the frontend is making requests to the correct API URL

### Media Upload Issues
- Verify Cloudinary credentials are correct
- Check that the Cloudinary account has sufficient storage

### Database Connection Issues
- Ensure `MONGO_URI` is correctly formatted and accessible
- Check that IP whitelisting is configured correctly in MongoDB Atlas

## Scaling Considerations

- Consider using a CDN for media files
- Implement caching strategies
- Use load balancing for high traffic
- Monitor database performance and optimize queries
- Consider using Redis for session storage