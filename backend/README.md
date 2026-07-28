# Futsal Buddy - Backend API

A comprehensive RESTful API for the Futsal Buddy platform built with Node.js, Express, TypeScript, and MongoDB.

## 🎯 Features

### Authentication & User Management
- ✅ User registration (player, organizer, admin roles)
- ✅ User login with JWT authentication
- ✅ Profile management (view, edit)
- ✅ Profile photo upload
- ✅ Password change functionality

### File Management
- ✅ Image file upload with validation
- ✅ Static file serving
- ✅ Secure file storage with unique filenames

### Core Features
- ✅ Player profiles with statistics
- ✅ Match management
- ✅ Team management
- ✅ Admin dashboard
- ✅ AI insights for players

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/futsal_buddy
SECRET_KEY=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Create Uploads Directory

```bash
mkdir uploads
```

### 4. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 5. Build for Production

```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register` | Create new account | No |
| POST | `/login` | Login user | No |
| GET | `/profile` | Get user profile | Yes |
| PATCH | `/profile` | Update user profile | Yes |
| POST | `/change-password` | Change password | Yes |

### File Upload (`/api/v1/upload`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/` | Upload file | No |
| DELETE | `/:filename` | Delete file | No |

### Static Files

- Access uploaded files: `GET /uploads/:filename`

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ File type validation (images only)
- ✅ File size limits (5MB max)
- ✅ CORS protection
- ✅ Input validation with Zod

## 📂 Project Structure

```
src/
├── configs/          # Configuration files
│   ├── constant.ts   # Constants
│   └── multer.config.ts  # File upload config
├── controllers/      # Request handlers
│   ├── user.controller.ts
│   ├── upload.controller.ts
│   └── ...
├── models/           # MongoDB schemas
│   ├── user.model.ts
│   ├── player.model.ts
│   └── ...
├── services/         # Business logic
│   ├── user.service.ts
│   └── ...
├── routes/           # API routes
│   ├── user.route.ts
│   ├── upload.route.ts
│   └── ...
├── middlewares/      # Custom middleware
├── dtos/             # Data transfer objects
├── types/            # TypeScript types
├── exceptions/       # Custom exceptions
├── utils/            # Utility functions
└── app.ts            # Express app setup
```

## 🧪 Testing with Postman

### 1. Register User
```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "role": "player"
}
```

### 2. Login
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Get Profile
```
GET http://localhost:5000/api/v1/auth/profile
Authorization: Bearer <token_from_login>
```

### 4. Upload Photo
```
POST http://localhost:5000/api/v1/upload
Content-Type: multipart/form-data

[Form Data]
file: <select_image_file>
```

### 5. Update Profile
```
PATCH http://localhost:5000/api/v1/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "profilePhoto": "/uploads/filename.jpg"
}
```

### 6. Change Password
```
POST http://localhost:5000/api/v1/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **multer**: File upload handling
- **zod**: Schema validation
- **cors**: Cross-origin resource sharing

## 🛠️ Development

### Code Style
- TypeScript for type safety
- Consistent naming conventions
- Modular architecture
- Clean separation of concerns

### Error Handling
- Global error handler
- Custom HTTP exceptions
- Proper HTTP status codes
- Meaningful error messages

## 📝 Git Commits

When committing changes:

```bash
git add .
git commit -m "feat: Add feature description

- Detail of changes
- More changes
- Why this matters"
git push origin main
```

## 🚨 Common Issues

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### File Upload Issues
- Check `/uploads` directory exists
- Verify file size < 5MB
- Ensure file is image type (jpg, png, webp, gif)

## 📄 License

This project is part of the ST6003CEM Web API Development coursework.

## 👨‍💻 Support

For issues or questions, refer to the inline code documentation and comments.

---

**Last Updated**: July 2026
**Version**: 1.0.0
