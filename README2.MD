# Full-Stack Authentication System

A secure authentication system with JWT, Google OAuth, and role-based access control.

## Technologies Used

### Frontend
- **React 19** (with Vite)
- **State Management**: Redux Toolkit, React-Redux
- **Routing**: React Router
- **UI**: React Bootstrap
- **Authentication**: JWT, Google OAuth (@react-oauth/google)
- **HTTP Client**: Axios
- **Testing**: Cypress (E2E)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, bcrypt, Google Auth Library
- **API Docs**: Swagger UI
- **Logging**: Winston (console, file, MongoDB)
- **Testing**: Jest (unit/integration)
- **Validation**: Mongoose schema validation

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Google OAuth 2.0 integration
- Role-based authorization (admin/user)
- Protected routes
- Comprehensive API documentation
- Centralized logging system
- CRUD operations for user management

## File Structure

```
login-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── GoogleSuccess.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── NewUserForm.jsx
│   │   │   ├── UserDetail.jsx
│   │   │   └── UserLogedInView.jsx
│   │   ├── services/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── cypress/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── message.controller.js
│   │   └── user.controller.js
│   ├── daos/
│   │   └── user.dao.js
│   ├── dtos/
│   │   └── user.dto.js
│   ├── middlewares/
│   │   └── verification.middleware.js
│   ├── models/
│   │   └── users.models.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── message.routes.js
│   │   └── user.routes.js
│   ├── services/
│   │   └── auth.service.js
│   ├── logger/
│   │   └── logger.js
│   ├── tests/
│   ├── app.js
│   ├── server.js
│   ├── swagger.js
│   └── package.json
│
├── .env
└── README.md
```

## Setup Instructions

### Backend
1. Create `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
SECRET=your_jwt_secret_key
TOKEN_SECRET=your_token_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=your_redirect_uri
```

2. Install dependencies:
```bash
npm install
```

3. Start server:
```bash
npm start
```

### Frontend
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Testing
### Backend (Jest)
```bash
npm test
```

### Frontend (Cypress)
```bash
npx cypress open
```

## API Documentation
Access Swagger UI at:
```
http://localhost:3000/api-docs
```

## Deployment
The application is configured for deployment with:
* Render (backend)
* Vite (frontend)
* MongoDB Atlas (database)