const m2s = require('mongoose-to-swagger');
const User = require('./models/users.models');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "User and Auth API",
      description: "An application for managing users and authentication (JWT and Google login)",
    },
    components: {
      schemas: {
        User: m2s(User)
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // 👇 This is the critical part: tell swagger-jsdoc where to find your route/controller annotations
  apis: ['./routes/*.js', './controllers/*.js'], // adjust paths if needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
