require('dotenv').config()
require('express-async-errors')
const url = require('url');
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user.routes.js')
const authRoutes = require('./routes/auth.routes.js')
const { log } = require('winston')
const logger = require('./logger/logger.js');
const swaggerSpec = require('./swagger.js');
const swaggerUI = require('swagger-ui-express')

const app = express()
app.use(cors())
app.use(express.static('dist')) // να το δοκιμασω
app.use(express.json());
// Set up Swagger UI endpoint
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    // console.log('connected to MongoDB', process.env.MONGODB_URI)
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use((req, res, next) => {
  const pathname = url.parse(req.originalUrl).pathname;
  logger.info(`${req.method} ${pathname}`);
  next();
});

app.use('/api/users', userRoutes)
app.use('/api/login', authRoutes)
app.use('/api/auth', authRoutes)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app