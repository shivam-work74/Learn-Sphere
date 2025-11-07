# LearnSphere - Learning Management System

LearnSphere is a comprehensive Learning Management System (LMS) built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication (Student, Instructor, Admin roles)
- Course management (Create, Read, Update, Delete)
- Video lessons with progress tracking
- Quiz system for assessments
- Real-time messaging with Socket.IO
- Cloud-based image and file storage with Cloudinary
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for media storage

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd learnsphere
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)

Create a `.env` file in the `frontend` directory with the following variables:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the Application

#### Development Mode

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately
npm run backend  # Runs backend only
npm run frontend # Runs frontend only
```

#### Production Mode

```bash
# Build the frontend
npm run build

# Start the backend (serves frontend build from /frontend/dist)
npm start
```

## Deployment

### Backend Deployment

1. Set environment variables according to your production environment
2. Deploy to your preferred hosting platform (Heroku, AWS, DigitalOcean, etc.)
3. Make sure to set the `NODE_ENV` to `production`

### Frontend Deployment

The frontend can be deployed to platforms like Vercel, Netlify, or served by the backend.

#### Vercel Deployment

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Set the build command to `npm run build`
5. Set the output directory to `dist`

## Project Structure

```
learnsphere/
├── backend/
│   ├── config/         # Configuration files (Cloudinary)
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── server.js       # Entry point
│   └── .env            # Environment variables
├── frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── api/        # API client
│   │   ├── components/ # React components
│   │   ├── context/    # React context providers
│   │   ├── pages/      # Page components
│   │   ├── App.jsx     # Main app component
│   │   └── index.jsx   # Entry point
│   ├── .env            # Environment variables
│   └── vite.config.js  # Vite configuration
└── package.json        # Root package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (Protected)

### Courses
- GET `/api/courses` - Get all courses
- GET `/api/courses/:id` - Get a specific course
- POST `/api/courses` - Create a new course (Instructor only)
- PUT `/api/courses/:id` - Update a course (Instructor only)
- GET `/api/courses/my-courses` - Get instructor's courses (Instructor only)

### Users
- GET `/api/users/profile` - Get user profile (Protected)
- PUT `/api/users/profile` - Update user profile (Protected)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.