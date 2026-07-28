# Futsal Buddy - Frontend

A modern, responsive React/Next.js application for the Futsal Buddy platform. Users can register, login, manage their profiles, upload photos, and change passwords.

## 🎯 Features

- ✅ User authentication (register/login)
- ✅ Profile management with photo upload
- ✅ Profile photo display
- ✅ Change password functionality
- ✅ Responsive mobile-first design
- ✅ Real-time form validation
- ✅ Error and success notifications
- ✅ Protected routes with authentication
- ✅ Modern UI with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:5000`

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env.local` file (optional, API base URL is hardcoded):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

Application will run on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## 📂 Project Structure

```
app/
├── layout.tsx              # Root layout with navigation
├── page.tsx                # Home page
├── globals.css             # Global styles
├── profile/
│   └── page.tsx            # User profile page
├── change-password/
│   └── page.tsx            # Change password page
├── login/
│   ├── page.tsx            # Login page
│   └── LoginForm.tsx       # Login form component
├── register/
│   └── ...                 # Register page
├── dashboard/
│   └── ...                 # Dashboard page
└── admin/
    └── ...                 # Admin pages
```

## 🔐 Authentication Flow

1. User registers at `/register`
2. User login at `/login`
3. JWT token stored in localStorage
4. Token sent in `Authorization: Bearer <token>` header
5. Protected routes check token validity
6. Token included in all authenticated API calls

## 📄 Pages

### Login (`/login`)
- Email and password form
- Validation and error handling
- Redirect to dashboard on success
- Link to register

### Register (`/register`)
- User registration form
- Role selection (player/organizer/admin)
- Password confirmation
- Email validation

### Profile (`/profile`)
- Display user information
- Profile photo upload
- Edit profile form
- Change password link
- Success/error notifications

### Change Password (`/change-password`)
- Current password verification
- New password with confirmation
- Password strength validation
- Redirect to profile on success

## 🎨 UI Components & Styling

### Built with:
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS
- **TypeScript** - Type safety

### Key Features:
- Responsive grid layouts
- Form inputs with focus states
- Alert notifications (green for success, red for errors)
- Loading states on buttons
- Mobile-friendly navigation

## 🔌 API Integration

### Key Endpoints Used:

```typescript
// Authentication
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/profile
PATCH /api/v1/auth/profile
POST /api/v1/auth/change-password

// File Upload
POST /api/v1/upload
DELETE /api/v1/upload/:filename

// Static Files
GET /uploads/:filename
```

### API Error Handling

All API calls include:
- Error message display
- Loading states
- Token validation
- Redirect to login on 401 Unauthorized

## 📝 Form Validation

### Client-side Validation:
- Email format
- Password length (min 6 characters)
- Password confirmation matching
- Required field checking
- File type validation (images only)
- File size validation (max 5MB)

## 🧪 Testing

### Manual Testing Steps:

1. **Register User**
   - Go to `/register`
   - Fill form with valid data
   - Submit and verify success message
   - Redirect to login

2. **Login**
   - Go to `/login`
   - Enter credentials
   - Verify token in localStorage
   - Redirect to dashboard

3. **View Profile**
   - Go to `/profile`
   - Verify user information displays
   - Check profile photo (if uploaded)

4. **Upload Profile Photo**
   - Go to `/profile`
   - Click "Edit Profile"
   - Select image file
   - Preview shows new image
   - Click "Save Changes"
   - Verify photo saved

5. **Change Password**
   - Go to `/change-password`
   - Enter current password
   - Enter new password twice
   - Submit and verify success
   - Try logging in with new password

## 🔒 Security

- Passwords never logged or displayed
- Tokens stored in localStorage
- CORS enabled for API communication
- Input validation before submission
- File type and size restrictions

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts adapt to screen size
- Touch-friendly button sizes
- Readable typography on all devices
- Optimized for:
  - Mobile (320px+)
  - Tablet (768px+)
  - Desktop (1024px+)

## 🎯 Performance

- Code splitting with Next.js
- Lazy loading of components
- Optimized images
- Efficient re-renders with React hooks
- Minimal bundle size

## 🐛 Troubleshooting

### Backend API Not Responding
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API URL in fetch calls

### Images Not Loading
- Check `/uploads` directory exists on backend
- Verify file paths are correct
- Clear browser cache

### Token Expiration
- Check JWT expiration in backend (30 days)
- Clear localStorage and login again
- Implement token refresh if needed

### Forms Not Submitting
- Check browser console for errors
- Verify backend is running
- Inspect network tab for API responses

## 📦 Dependencies

```json
{
  "next": "16.2.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "tailwindcss": "^4"
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
docker build -t futsal-buddy-frontend .
docker run -p 3000:3000 futsal-buddy-frontend
```

## 📝 Git Commits

```bash
git add .
git commit -m "feat: Add profile management features

- Create profile page with photo upload
- Create change password page
- Add profile navigation
- Implement form validation
- Add success/error notifications

This enables users to:
✅ View and edit their profile
✅ Upload/change profile photo
✅ Change password securely"

git push origin main
```

## 📞 Support

For API-related issues, check the Backend README.
For UI/styling issues, refer to Tailwind CSS documentation.

---

**Last Updated**: July 2026
**Version**: 1.0.0
**Framework**: Next.js 16 + React 19
