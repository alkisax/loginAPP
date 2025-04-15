require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); // import the Express app from app.js

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });