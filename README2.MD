# MERN Login Application

This is a **full-stack login application** built using the **MERN stack** (MongoDB, Express, React, Node.js). It is designed as a general-purpose authentication system for future integration into other projects.  

The app supports traditional email/password login as well as **Google OAuth login**, using secure and modern practices such as **JWT** authentication and **bcrypt** password hashing.

🔗 **Live Demo**: [https://loginapp-tjlf.onrender.com](https://loginapp-tjlf.onrender.com)

---

## 🔧 Features

- 🔐 **JWT-based Authentication**
- 🔑 **Google OAuth Login**
- 🔒 **Password Hashing with bcrypt**
- 🗂️ **DTO/DAO Pattern** for clean code architecture
- 📄 **Rendered React Pages** 
- 🧪 **Testing with Jest** (backend unit tests)
- 🧪 **Testing with Cypress** (end-to-end tests)
- 📚 **Swagger API Documentation**
- 🛠️ **Winston Logger** for backend logging
- 🚀 **Deployed on Render**

---

## 🧱 Tech Stack

### Frontend
- React (Render pages)
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- DTOs, DAOs, Services, and Controllers
- Bcrypt
- JWT (access/refresh tokens)
- Google OAuth
- Winston (logging)
- Swagger (API docs)

### Testing
- Jest (unit tests)
- Cypress (E2E tests)

---

## 📦 Project Structure

```
backend/
├── __test__/
│   ├── login.test.js
│   ├── message.test.js
│   └── user.test.js
├── controllers/
│   ├── auth.controller.js
│   ├── message.controller.js
│   └── user.controller.js
├── cypress/
│   ├── e2e/
│   │   └── loginApp.cy.js
├── services/
│   └── auth.service.js
├── routes/
│   ├── auth.routes.js
│   ├── message.routes.js
│   └── user.routes.js
├── models/
│   └── user.models.js
├── dtos/
│   └── user.dto.js
├── daos/
│   └── user.dao.js
├── middlewares/
│   └── verification.middleware.js
├── swagger.js
├── server.js
├── app.js
├── .env
├── package.json
├── README.MD
├── INSTRUCTIONS.MD


frontend/
├── components/
│   ├── AdminPanel.jsx
│   ├── GoogleSuccess.jsx
│   ├── LoginForm.jsx
│   ├── NewUserForm.jsx
│   ├── UserDetail.jsx
│   └── UserLogedInView.jsx
├── services/
│   └── ProtectedROute.jsx
├── App.jsx
├── Main.jsx

```

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

```bash
# Clone the repository
git clone hhttps://github.com/alkisax/loginAPP
```

## 📄 API Documentation

Swagger UI is available at:
```
https://loginapp-tjlf.onrender.com/api-docs
```

## 📌 Notes

- This app is designed for general use and can be extended or integrated into larger applications.
- Both frontend and backend are structured for maintainability and scalability.
- Follows best practices in authentication, testing, logging, and architecture.