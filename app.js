require('dotenv').config()
require('express-async-errors')
const url = require('url');
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user.routes.js')
const authRoutes = require('./routes/auth.routes.js')
const messageRoutes = require('./routes/message.routes.js')
const { log } = require('winston')
const logger = require('./logger/logger.js');
const swaggerSpec = require('./swagger.js');
const swaggerUI = require('swagger-ui-express')

const app = express()
app.use(cors())
app.use(express.static('dist')) // να το δοκιμασω
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec)); // Set up Swagger UI endpoint
app.use((req, res, next) => {
  const pathname = url.parse(req.originalUrl).pathname;
  logger.info(`${req.method} ${pathname}`);
  next();
});

app.use('/api/users', userRoutes)
app.use('/api/login', authRoutes)
app.use('/api/message', messageRoutes)

module.exports = app