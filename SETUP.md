# Setup Guide

This guide will help you set up both the frontend and backend for the myself e-commerce application.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- npm or yarn

## Backend Setup




1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/myself
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@myself.com
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Replace `JWT_SECRET` with a strong random string
- For Gmail, you'll need to use an App Password (not your regular password)
- Update `MONGODB_URI` if using MongoDB Atlas or a different connection string

4. Make sure MongoDB is running:
   - **Local MongoDB**: Start MongoDB service on your system
   - **MongoDB Atlas**: Use your connection string in `MONGODB_URI`

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to the project root (if not already there):
```bash
cd ..
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Install Redux Toolkit (if not already installed):
```bash
npm install @reduxjs/toolkit
```

4. Create a `.env` file in the root directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

If you don't create this file, the frontend will default to `http://localhost:5000/api`

5. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Testing the Setup

1. **Backend Health Check:**
   - Open `http://localhost:5000/api/health` in your browser
   - You should see: `{"status":"OK","message":"Server is running",...}`

2. **Frontend:**
   - Open `http://localhost:3000` in your browser
   - You should see the login page

3. **Test Registration:**
   - Navigate to `/register`
   - Create a new account
   - Check your email for verification link (if email is configured)

## API Endpoints

All API endpoints are prefixed with `/api`:

- Authentication: `/api/auth/*`
- Users: `/api/users/*`
- Products: `/api/products/*`
- Categories: `/api/categories/*`
- Brands: `/api/brands/*`
- Cart: `/api/cart/*`
- Orders: `/api/orders/*`
- Payments: `/api/payments/*`
- Reviews: `/api/reviews/*`

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error:**
   - Make sure MongoDB is running
   - Check your `MONGODB_URI` in `.env`
   - For MongoDB Atlas, ensure your IP is whitelisted

2. **Port Already in Use:**
   - Change `PORT` in `.env` to a different port
   - Or stop the process using port 5000

3. **Email Not Sending:**
   - Check your email credentials in `.env`
   - For Gmail, enable 2FA and use App Password
   - The application will continue to work even if email fails

### Frontend Issues

1. **Cannot Connect to Backend:**
   - Make sure backend is running on port 5000
   - Check `REACT_APP_API_URL` in `.env`
   - Check browser console for CORS errors

2. **Redux Errors:**
   - Make sure `@reduxjs/toolkit` is installed
   - Check that the store is properly configured

## Development

- Backend uses `nodemon` for auto-restart on file changes
- Frontend uses React's hot-reload feature
- Both servers should be running simultaneously for full functionality

## Production

For production deployment:

1. **Backend:**
   - Set `NODE_ENV=production`
   - Use a strong `JWT_SECRET`
   - Configure production MongoDB connection
   - Set up proper email service
   - Configure CORS for your frontend domain

2. **Frontend:**
   - Build the app: `npm run build`
   - Set `REACT_APP_API_URL` to your production API URL
   - Deploy the `build` folder to your hosting service

## Next Steps

1. Implement the frontend pages (login, register, dashboard, etc.)
2. Connect Redux slices to API calls
3. Add image upload functionality for products
4. Implement payment gateway integration
5. Add more features as needed
