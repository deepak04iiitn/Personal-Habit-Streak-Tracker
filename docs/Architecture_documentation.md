# Habit Tracker API - System Architecture

## Introduction

This document outlines the architecture and design decisions for our habit tracking application. The system was built using a modern Node.js stack with MongoDB, designed to handle personal habit management with robust tracking capabilities.

## Architecture Overview

The application follows a traditional three-tier architecture with clear separation of concerns:

- **Client Layer**: Frontend application (served as static files)
- **Application Layer**: Express.js REST API
- **Data Layer**: MongoDB database with Mongoose ODM

### Design Philosophy

I prioritized simplicity and maintainability while ensuring the system could handle typical usage patterns. The architecture supports standard CRUD operations with additional business logic for habit tracking and statistics.

## Technology Stack

**Backend Framework**: Express.js  
**Database**: MongoDB with Mongoose  
**Authentication**: JWT tokens with bcryptjs for password hashing  
**Testing**: Jest with Supertest for API testing  
**Environment Management**: dotenv for configuration  

Additional middleware includes CORS for cross-origin requests, cookie-parser for session management, and custom error handling utilities.

## Project Structure

```
/
├── config/
│   └── db.js                    
├── controllers/
│   ├── auth.controller.js       
│   └── habit.controller.js      
├── models/
│   ├── user.model.js           
│   └── habit.model.js          
├── routes/
│   ├── auth.route.js           
│   └── habit.route.js          
├── utils/
│   ├── error.js                
│   └── verifyUser.js           
├── tests/
│   ├── setup/
│   ├── integration/
│   └── unit/
└── index.js                    
```

This structure separates concerns effectively - routes handle HTTP requests, controllers contain business logic, models define data structures, and utilities provide shared functionality.

## Data Models

### User Schema

```javascript
{
  username: String,      // unique, required
  email: String,         // unique, required  
  password: String,      // hashed, required
  timestamps: true       // createdAt, updatedAt
}
```

### Habit Schema

```javascript
{
  title: String,         // 3-100 chars, unique per user
  description: String,   // optional, max 500 chars
  category: String,      // predefined enum values
  isDaily: Boolean,      // default true
  streakCount: Number,   // current streak
  longestStreak: Number, // historical best
  lastCompleted: Date,   // last completion date
  completions: Array,    // completion history
  owner: ObjectId,       // reference to User
  timestamps: true
}
```

The habit model includes a virtual field `completionRate` that calculates the percentage based on completions versus days since creation.

## API Design

### Authentication Endpoints

- `POST /backend/auth/signup` - User registration
- `POST /backend/auth/signin` - User login  
- `POST /backend/auth/logout` - Session termination
- `GET /backend/auth/me` - Current user profile
- `DELETE /backend/auth/delete-profile` - Account deletion

### Habit Management Endpoints  

- `POST /backend/habits/create-new-habit` - Create new habit
- `GET /backend/habits/my-habits` - List user habits (with filtering)
- `GET /backend/habits/:id/details` - Get specific habit
- `PUT /backend/habits/:id/update` - Modify habit
- `DELETE /backend/habits/:id/remove` - Delete habit
- `POST /backend/habits/:id/mark-complete` - Mark daily completion
- `GET /backend/habits/:id/statistics` - Habit analytics
- `GET /backend/habits/my-summary` - User overview

All habit endpoints require authentication and enforce user ownership of resources.

## Authentication System

I implemented JWT-based authentication with the following flow:

1. User provides credentials via signin endpoint
2. Server validates credentials against database
3. If valid, server generates JWT token and sets HTTP-only cookie
4. Subsequent requests include cookie automatically
5. Middleware verifies token and adds user info to request object

The `verifyUser` middleware protects all sensitive endpoints and ensures users can only access their own data.

## Business Logic

### Habit Completion Tracking

The core functionality revolves around daily habit completion:

```javascript
updateStreak() {
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(today - 86400000);
  
  if(this.lastCompleted && 
      new Date(this.lastCompleted).setHours(0, 0, 0, 0) === yesterday) {
    this.streakCount++;
  } else {
    this.streakCount = 1;
  }
  
  if(this.streakCount > this.longestStreak) {
    this.longestStreak = this.streakCount;
  }
  
  this.lastCompleted = new Date();
  this.completions.push({ date: new Date() });
}
```

### Statistics Generation

The system provides detailed analytics:
- Current and longest streaks
- Completion rates (overall and period-specific)
- Daily completion status
- Category-based grouping

## Testing Strategy

My testing approach covers multiple layers:

**Unit Tests**: Model validation, business logic methods  
**Integration Tests**: API endpoint functionality, authentication flows  
**Security Tests**: Access control, input validation, boundary conditions  
**End-to-End Tests**: Complete user workflows from signup to habit management

I used MongoDB Memory Server for test isolation and SuperTest for HTTP testing. Test helpers provide common functionality like user creation and authentication token generation.

## Security Considerations

**Data Protection**: Users can only access their own habits through ownership validation  
**Password Security**: bcryptjs hashing with salt rounds  
**Session Management**: HTTP-only cookies prevent XSS attacks  
**Input Validation**: Comprehensive request validation at model and controller levels  
**Error Handling**: Centralized error processing without sensitive information exposure

## Performance Optimizations

**Database Indexing**: Compound indexes on frequently queried fields  
**Pagination**: Configurable page sizes for habit listing (max 50 per page)  
**Query Optimization**: Selective field population and lean queries where appropriate  
**Virtual Fields**: Calculated properties without additional storage overhead

## Error Handling

The application uses a centralized error handling pattern:

```javascript
// Custom error creation
const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
}

// Global error middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
```

Controllers use `next(errorHandler(400, 'Custom message'))` to trigger consistent error responses.

## Deployment Configuration

The application serves the frontend build files directly from Express, making it suitable for single-server deployment. Key environment variables:

- `PORT` - Server port (default 5000)
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - Token signing key
- `NODE_ENV` - Environment designation

Static file serving handles any non-API routes by serving the React application, enabling client-side routing.

