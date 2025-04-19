# Οδηγίες Δημιουργίας Login Application

## Αρχικοποίηση Git
```bash
git init
git remote add origin git@github.com:alkisax/loginAPP.git
git pull origin main
```

## Δημιουργία Frontend (Vite)
```bash
npm create vite@latest frontend -- --template react
npm install
npm install axios
npm install react-bootstrap
npm install react-router-dom
npm install redux
npm install react-redux
npm install @reduxjs/toolkit
```

## Δημιουργία Backend
```bash
npm init
npm install express
npm install mongoose
npm install dotenv
npm install bcrypt
npm install jsonwebtoken
npm install swagger-ui-express
npm install mongoose-to-swagger
npm install swagger-jsdoc
npm install winston
npm install winston-daily-rotate-file
npm install winston-mongodb
npm install google-auth-library
npm install axios
npm install cors
npm install morgan
npm install express-async-errors
npm install --save-dev nodemon
npm install --save-dev supertest
npm install --save-dev cross-env
npm install prop-types
npm install --save-dev jest @babel/preset-env @babel/preset-react eslint-plugin-jest
npm install --save-dev deep-freeze
```

**Σημείωση**: Επειδή υπήρξε conflict με το express-async-errors, έγινε downgrade στο express:
```bash
npm install express@4
```

## Δημιουργία Login Form
```jsx
return (
  <>
    <form onSubmit={handleLogin}>
      <div>
        username
        <input type="text"
        value={username}
        name="username"
        onChange={({target}) => setUsername(target.value)}
        autoComplete="username"
        />
      </div>
      <div>
        password
        <input type="text"
        value={password}
        name="password"
        onChange={({target}) => setPassword(target.value)}
        autoComplete="password"
        />
      </div>
    </form>
  </>
)
```

## Custom View στο Frontend

Προσθήκη του component `userLogedInView.jsx`:
```jsx
const UserLogedInView = () => {
  return (
    <>
      <h1>Welcome user</h1>
    </>
  )
}
export default UserLogedInView
```

Ενημέρωση του `App.jsx`:
```jsx
import UserLogedInView from './components/userLogedInView'

const App = () => {
  const [user, setUser] = useState(null)

  return (
    <div>
      <h1>Login APP</h1>
      {user === null && <LoginForm />}
      {user !==  null && <UserLogedInView />}
    </div>
  )
}
```

## Δημιουργία Βασικού CRUD στο Backend

Προσθήκη scripts στο `package.json`:
```json
"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## Δημιουργία .env
```
MONGODB_URI = mongodb+srv://alkis:{password}@cluster0.8ioq6.mongodb.net/loginAp?retryWrites=true&w=majority&appName=Cluster0
```

## Οργάνωση Φακέλων
Δημιουργία φακέλων: routes, models, controllers, services

## Δημιουργία Models

### users.models.js
```javascript
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
  username:{
    type: String,
    required: [true, 'username is required'],
    unique:true
  },
  name:{
    type: String,
    required: false
  },
  roles:{
    type: [String],
    default: ['user']
  },
  email:{
    type: String,
    required: false,
    unique: true
  },
  password:{
    type: String,
    required: [true, 'password is required'],
  },
},
{
  collection: 'users',
  timestamps: true
})
module.exports = mongoose.model('User', userSchema)
```

## Δημιουργία Controllers

### user.controller.js
```javascript
const User = require('../models/users.models')

exports.findAll = async (req,res) => {
 const results = await User.find()
 res.json(results)
}
```

## Δημιουργία Routes

### user.routes.js
```javascript
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller.js')

router.get ('/', userController.findAll)

module.exports = router
```

## Δημιουργία Server

### server.js
```javascript
require('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user.routes.js')
const { log } = require('winston')

const app = express()
app.use(cors())
app.use(express.static('dist')) // να το δοκιμασω
app.use(express.json());

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    // console.log('connected to MongoDB', process.env.MONGODB_URI)
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use('/api/users', userRoutes)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app
```

## Προσθήκη Λειτουργίας Δημιουργίας Χρήστη

### Ενημέρωση του user.controller.js
```javascript
exports.create = async (req,res) => {
  const username = req.body.username
  const name = req.body.name
  const password = req.body.password
  const email = req.body.email
  const roles = req.body.roles

  // na prostethei elegxos me if

  try {
    const newUser = new User({
      username: username,
      name: name,
      password: password,
      email: email,
      roles: roles
    })
    await newUser.save()
    res.status(201).json(newUser)
  } catch(error) {
    res.status(400).json({error: error.message})
  }
}
```

### Ενημέρωση του user.routes.js
```javascript
router.get ('/', userController.findAll)
router.post('/', userController.create)
```

## Δοκιμή με Postman

- GET στο `localhost:3000/api/users`: Λαμβάνουμε `{ "status": true, "data": [] }`
- POST στο `localhost:3000/api/users` με body:
  ```json
  {
      "username":"alkisax",
      "name":"alkis",
      "roles":["admin"],
      "email": "alkisax@gmail.com",
      "password":"123"
  }
  ```
  Λαμβάνουμε:
  ```json
  {
      "username": "alkisax",
      "name": "alkis",
      "roles": [
          "admin"
      ],
      "email": "alkisax@gmail.com",
      "password": "123",
      "_id": "67fc141a3af9a6a44597fc51",
      "createdAt": "2025-04-13T19:44:26.990Z",
      "updatedAt": "2025-04-13T19:44:26.990Z",
      "__v": 0
  }
  ```

## Μετατροπή του Password σε hashedPassword

### Ενημέρωση του users.models.js
```javascript
// password:{
//   type: String,
//   required: [true, 'password is required'],
// },
hashedPassword: {
  type: String,
  required: [true, 'password is required'],
}
```

### Ενημέρωση του user.controller.js
```javascript
const bcrypt = require('bcrypt')

// Στο exports.create
const SaltOrRounds = 10
const hashedPassword = await bcrypt.hash(password, SaltOrRounds)

// Και το newUser γίνεται:
const newUser = new User({
  username: username,
  name: name,
  hashedPassword: hashedPassword,
  email: email,
  roles: roles
})
```

## Δημιουργία Login Endpoint

### services/auth.service.js
```javascript
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

generateAccessToken = (user) => {
  const payload = {
    username: user.username,
    email: user.email,
    roles: user.roles,
    id: user._id
  }

  const secret = process.env.SECRET
  const options = {
    expiresIn: '1h'
  }
  const token = jwt.sign(payload, secret, options)
  return token
}

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const verifyAccessToken = (token) => {
  const secret = process.env.SECRET
  try {
    const payload = jwt.verify(token, secret)
    return { 
      verified: true, data: payload
    }
  } catch (error) {
    return { 
      verified: false, data: error.message
    }
  }
} 

module.exports = {
  generateAccessToken,
  verifyPassword,
  verifyAccessToken
}
```

### auth.controller.js
```javascript
const bcrypt = require('bcrypt')
const User = require('../models/users.models')

exports.findAll = async (req,res) => {
 const results = await User.find()
 res.json({
  status: true,
  data: results
})
}

exports.create = async (req,res) => {
  let data = req.body

  const username = req.body.username
  const name = req.body.name
  const password = req.body.password
  const email = req.body.email
  const roles = req.body.roles

  const SaltOrRounds = 10
  const hashedPassword = await bcrypt.hash(password, SaltOrRounds)

  // na prostethei elegxos me if

  try {
    const newUser = new User({
      username: username,
      name: name,
      hashedPassword: hashedPassword,
      email: email,
      roles: roles
    })
    await newUser.save()
    res.status(201).json(newUser)
  } catch(error) {
    res.status(400).json({error: error.message})
  }
}
```

### auth.routes.js
```javascript
const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/', authController.login)

module.exports = router
```

### Ενημέρωση server.js
```javascript
const authRoutes = require('./routes/auth.routes.js')

app.use('/api/users', userRoutes)
app.use('/api/login', authRoutes)
```

## Δοκιμή Login με Postman

- POST στο `localhost:3000/api/login` με body:
  ```json
  {
      "username": "alkisax",
      "password": "123"
  }
  ```
  Λαμβάνουμε:
  ```json
  {
    "status": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsa2lzYXgiLCJlbWFpbCI6ImFsa2lzYXhAZ21haWwuY29tIiwicm9sZXMiOlsiYWRtaW4iXSwiaWQiOiI2N2ZjYTljODI1YWM4ZTBhMTM0N2JjZDQiLCJpYXQiOjE3NDQ2MTIzMTksImV4cCI6MTc0NDYxNTkxOX0.BCsm61ls3meU3ZOxgeQrZ3fNFTm7_5jru65qfrOBKyg",
        "user": {
            "username": "alkisax",
            "email": "alkisax@gmail.com",
            "roles": [
                "admin"
            ],
            "id": "67fca9c825ac8e0a1347bcd4"
        }
     }
  }
  ```

## Επαλήθευση Token για Route Protection

### Προσθήκη στο auth.service.js
```javascript
const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
```

### Ενημέρωση του user.controller.js
```javascript
exports.findAll = async (req,res) => {
  const results = await User.find()

  const token = authService.getTokenFrom(req)
  const verificationResult = authService.verifyAccessToken(token)
  if (!verificationResult.verified) {
    return res.status(401).json({
      status: false,
      error: verificationResult.data
    })
  }
  if (!verificationResult.data.roles.includes('admin')) {
    return res.status(403).json({
      status: false,
      error: 'Forbidden'
    })
  }

  res.json({
    status: true,
    data: results
  })
}
```

## Δοκιμή με Postman και Token
GET στο `localhost:3000/api/users` με Header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Λαμβάνουμε τη λίστα των χρηστών.

## Google Login

### Ρύθμιση στο Google Cloud Platform
1. https://cloud.google.com/gcp -> console -> select project -> new project
2. API and services -> credentials -> create credentials -> oauth client ID
3. Configure consent screen -> create oauth client -> web app
4. Auth redirect uri -> http://localhost:3000/api/auth/google/callback
5. Δημιουργία clients

### Προσθήκη στο .env
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### Ενημέρωση του server.js
```javascript
app.use('/api/auth', authRoutes)
```

### Ενημέρωση του auth.routes.js
```javascript
router.get('/google/callback', authController.googleLogin)
```

### Ενημέρωση του auth.controller.js
```javascript
exports.googleLogin = async(req, res) => {
  const code = req.query.code
  if (!code) {
    res.status(400).json({status: false, data: "auth code is missing"})
  } else {
    let { user } = await authService.googleAuth(code)
    return res.redirect('https://www.wikipedia.org') //προσορινα για λογους τεστινγκ
  }
}
```

### Ενημέρωση του auth.service.js
```javascript
const { OAuth2Client } = require('google-auth-library')
[...]
const googleAuth = async (code) => {
  console.log("Google login", code);
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    console.log("Step 1", tokens)
    oauth2Client.setCredentials(tokens)

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID
    });

    console.log("Step 2")

    const userInfo = await ticket.getPayload();
    console.log("Google User", userInfo);
    return {user: userInfo, tokens}
  } catch (error) {
    console.log("Error in google authentication", error);
    return { error: "Failed to authenticate with google"}
  }
}

module.exports = {
  generateAccessToken,
  verifyPassword,
  verifyAccessToken,
  getTokenFrom,
  googleAuth
}
```

### Προσθήκη σχολίου με το Link στα routes
```javascript
// https://accounts.google.com/o/oauth2/auth?client_id={apo_to_google}&redirect_uri={apo_to_google}&response_type={apo_to_auth.service}&scope=email%20profile&access_type=offline
```

## Δημιουργία Logger

### logger/logger.js
```javascript
const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.simple()
  ),
  transports: [
    new transports.Console(), // show logs in terminal

    new transports.File({      // save to file
      filename: 'logs/all.log'
    }),

    new transports.MongoDB({   // save to MongoDB
      db: process.env.MONGODB_URI || 'mongodb://localhost:27017/logsdb',
      collection: 'logs',
      level: 'info',  // logs info and above (warn, error)
    })
  ]
});

module.exports = logger;
```

### Ενημέρωση του server.js
```javascript
const url = require('url');
const logger = require('./logger/logger.js');
[...]
app.use((req, res, next) => {
  const pathname = url.parse(req.originalUrl).pathname;
  logger.info(`${req.method} ${pathname}`);
  next();
});
```

### Παραδείγματα Logging στους Controllers
```javascript
logger.error(`Login error: ${error.message}`);
logger.warn(`Failed login attempt with username: ${req.body.username}`);
logger.info(`User ${user.username} logged in successfully`);
if (user && user.email) {
  logger.info(`User ${user.email} logged in via Google`);
} else {
  logger.info('Google login succeeded, but user info is incomplete');
}
```

## Swagger Documentation

### Εγκατάσταση
```bash
npm install swagger-jsdoc
```

### swagger.js
```javascript
// Φόρτωση της βιβλιοθήκης που μετατρέπει Mongoose models σε Swagger schemas
const m2s = require('mongoose-to-swagger');
// Φόρτωση του Mongoose μοντέλου για τον χρήστη
const User = require('./models/users.models');
// Η βασική βιβλιοθήκη που δημιουργεί Swagger spec με βάση το configuration και τα JSDoc σχόλια
const swaggerJsdoc = require('swagger-jsdoc');
// Ορισμός ρυθμίσεων για τη Swagger τεκμηρίωση
const options = {
  definition: {
    // Ορισμός της έκδοσης OpenAPI (Swagger) που θα χρησιμοποιηθεί
    openapi: "3.1.0",
    // Πληροφορίες για το API μας (τίτλος, περιγραφή, έκδοση)
    info: {
      version: "1.0.0",
      title: "User and Auth API",
      description: "Μια εφαρμογή για τη διαχείριση χρηστών και την αυθεντικοποίηση με JWT και Google login",
    },
    // Ορισμός των components, δηλαδή των reusable στοιχείων του Swagger όπως schemas και security definitions
    components: {
      schemas: {
        // Εδώ δημιουργούμε το schema του χρήστη με βάση το Mongoose μοντέλο
        User: m2s(User)
      },
      // Ρύθμιση του μηχανισμού αυθεντικοποίησης με Bearer token (JWT)
      securitySchemes: {
        bearerAuth: {
          type: "http",          // Είδος αυθεντικοποίησης
          scheme: "bearer",      // Χρήση Bearer token
          bearerFormat: "JWT"    // Προσδιορίζουμε ότι είναι JWT
        }
      }
    },
    // Εφαρμογή της ασφάλειας (bearerAuth) σε όλα τα endpoints, εκτός αν οριστεί αλλιώς σε κάποιο συγκεκριμένο
    security: [
      {
        bearerAuth: []  // Δεν απαιτούνται scopes
      }
    ]
  },
  // 🔽 Το πιο σημαντικό σημείο: καθορίζουμε που βρίσκονται τα αρχεία που περιέχουν Swagger σχόλια (JSDoc)
  // Εδώ βλέπει στους φακέλους routes και controllers για Swagger annotations
  apis: ['./routes/*.js', './controllers/*.js'], // Μπορείς να προσθέσεις επιπλέον μονοπάτια αν χρειαστεί
};
// Δημιουργία του Swagger specification με βάση τις παραπάνω ρυθμίσεις
const swaggerSpec = swaggerJsdoc(options);
// Εξαγωγή του αντικειμένου ώστε να το φορτώσουμε από το server.js
module.exports = swaggerSpec;
```

### Ενημέρωση του server.js
```javascript
const swaggerSpec = require('./swagger.js');
const swaggerUI = require('swagger-ui-express')
[...]
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
```

### Swagger Annotations στους Controllers
```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all users from the database (admin access required).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: string
 *                       id:
 *                         type: string
 *       401:
 *         description: Unauthorized access (invalid or missing token)
 *       403:
 *         description: Forbidden access (non-admin role)
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Users
 */
exports.findAll = async (req,res) => {
```

Έλεγχος Swagger στο http://localhost:3000/api-docs/#/

## Middleware για Role-Based Access Control

### middleware/verification.middleware.js
```javascript
// middleware/verification.middleware.js

const authService = require('../services/auth.service');
const logger = require('../logger/logger');

/**
 * Middleware to verify JWT token.
 * Attaches decoded user data to `req.user` if valid.
 */
const verifyToken = (req, res, next) => {
  const token = authService.getTokenFrom(req);
  const verificationResult = authService.verifyAccessToken(token);

  if (!verificationResult.verified) {
    logger.warn(`Unauthorized access attempt with token: ${token}`);
    return res.status(401).json({
      status: false,
      error: verificationResult.data
    });
  }

  req.user = verificationResult.data;
  next();
};

/**
 * Middleware to check if user has required role.
 * Call after verifyToken middleware.
 */
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roles.includes(requiredRole)) {
      logger.warn(`Forbidden access by user: ${user?.username || 'unknown'}`);
      return res.status(403).json({
        status: false,
        error: 'Forbidden'
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};
```

### Ενημέρωση του user.controller.js
```javascript
exports.findAll = async (req,res) => {
  const results = await User.find()
  res.json({
    status: true,
    data: results
  })
}
```

### Ενημέρωση του user.routes.js
```javascript
const { verifyToken, checkRole } = require('../middleware/verification.middleware');
router.get ('/', verifyToken, checkRole('admin'), userController.findAll)
```

## Επόμενα Βήματα

1. Δημιουργία Jest/Supertest unit και integration tests για `/api/login` και `/api/users`
2. Δημιουργία minimal admin panel για διαχείριση χρηστών (CRUD frontend για `/api/users`)
3. Αποθήκευση του token στην προσωρινή μνήμη του browser
4. Σύνδεση frontend με server
5. Με router-dom επιπλέον σελίδα για users

# Οδηγός Ανάπτυξης Full Stack με Node.js και React

## Διαχωρισμός Server από App

### Αρχική Κατάσταση server.js

```javascript
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
  logger.info(${req.method} ${pathname});
  next();
});

app.use('/api/users', userRoutes)
app.use('/api/login', authRoutes)
app.use('/api/auth', authRoutes)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});

module.exports = app
```

### Διαχωρισμός σε Δύο Αρχεία

#### Νέο server.js
```javascript
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
```

#### Νέο app.js
```javascript
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
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec)); // Set up Swagger UI endpoint
app.use((req, res, next) => {
  const pathname = url.parse(req.originalUrl).pathname;
  logger.info(`${req.method} ${pathname}`);
  next();
});

app.use('/api/users', userRoutes)
app.use('/api/login', authRoutes)
app.use('/api/auth', authRoutes)

module.exports = app
```

## Εγκατάσταση Jest/Supertest για Unit και Integration Tests

### Εγκατάσταση απαραίτητων πακέτων
```bash
npm install --save-dev jest 
npm install --save-dev supertest
npm install --save-dev cross-env
npm install --save-dev dotenv
```

### Προσθήκη ρυθμίσεων Jest στο package.json
```json
"jest": {
  "collectCoverage":true,
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/logs"
  ],
  "setupFiles": [
    "dotenv/config"
  ]
},
"scripts": {
  "test": "cross-env NODE_ENV=test jest --testTimeout=50000"
}
```

### Δημιουργία .env αρχείου για test
```
MONGODB_TEST_URI = mongodb+srv://alkisax:{password}@cluster0.8ioq6.mongodb.net/loginAPP_TEST?retryWrites=true&w=majority&appName=Cluster0
```

### Δημιουργία Test για Login (__test__/login.test.js)
```javascript
const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");

const User = require("../models/users.models");
const authService = require("../services/auth.service");

const TEST_USER = {
  username: "testuser",
  name: "Test User",
  email: "testuser@example.com",
  password: "testpassword",
  roles: ["admin"]
};

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
  await User.deleteMany({});

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(TEST_USER.password, saltRounds)

  await User.create({
    username: TEST_USER.username,
    name: TEST_USER.name,
    email: TEST_USER.email,
    hashedPassword: hashedPassword,
    roles: TEST_USER.roles
  })
})

afterEach(async () => {
  await mongoose.connection.close();
})

afterAll(async () => {
  await mongoose.disconnect();
})

describe("POST /api/login", () => {
  it("should return a valid token and user data when credentials are correct", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: TEST_USER.username,
        password: TEST_USER.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user).toMatchObject({
      username: TEST_USER.username,
      email: TEST_USER.email,
      roles: TEST_USER.roles
    });
  });
});
```

## Μετατροπή σε DTO DAO Pattern

### Data Access Object (DAO)
#### daos/user.dao.js
```javascript
const User = require('../models/users.models');

const findAllUsers = async () => {
  return await User.find();
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

module.exports = {
  findAllUsers,
  findUserByUsername,
  findUserByEmail,
  createUser
};
```

### Αλλαγές στο user.controller.js
```javascript
const userDAO = require('../daos/user.dao')

exports.findAll = async (req, res) => {
  // transfer to dao
  // res.json({
  //   status: true,
  //   data: results
  // })
  const users = await userDAO.findAllUsers();
  res.json({ status: true, data: users });
}

exports.create = async (req, res) => {
  // ...
  // const newUser = new User({
  //   username: username,
  //   name: name,
  //   hashedPassword: hashedPassword,
  //   email: email,
  //   roles: roles
  // })
  // await newUser.save()
  const newUser = await userDAO.createUser({
    username,
    name,
    email,
    roles,
    hashedPassword
  });
  // ...
}
```

### Αλλαγές στο auth.controller.js
```javascript
const userDAO = require('../daos/user.dao')

// const user = await User.findOne({username: req.body.username})
const user = await userDAO.findUserByUsername(req.body.username);
```

### Data Transfer Object (DTO) - Ημιτελές
#### dtos/user.dto.js
```javascript
const toUserDTO = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    name: user.name,
    roles: user.roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

module.exports = {
  toUserDTO
};
```

## Περισσότερα Tests

### Βελτιώσεις στο auth.controller.js για Έλεγχο Κενών Πεδίων
```javascript
exports.login = async (req, res) => {
  try {
    const username = req.body.username
    const password = req.body.password

    if (!username) {
      logger.warn("Login attempt missing username");
      return res.status(400).json({
        status: false,
        message: "Username is required"
      });
    }
    
    if (!password) {
      logger.warn("Login attempt missing password");
      return res.status(400).json({
        status: false,
        message: "Password is required"
      });
    }
    // ...
```

### Περισσότερα Test Cases για Login
```javascript
it("should fail with wrong password", async () => {
  const res = await request(app)
    .post("/api/login")
    .send({
      username: TEST_USER.username,
      password: "wrongpassword"
    });

  expect(res.statusCode).toBe(401);
  expect(res.body.status).toBe(false);
  expect(res.body.message).toBe("Invalid username or password");
});

it("should fail with non-existent username", async () => {
  const res = await request(app)
    .post("/api/login")
    .send({
      username: "notARealUser",
      password: "anyPassword"
    });

  expect(res.statusCode).toBe(401);
  expect(res.body.status).toBe(false);
  expect(res.body.message).toBe("Invalid username or password");
});

it("should fail when username is missing", async () => {
  const res = await request(app)
    .post("/api/login")
    .send({
      password: TEST_USER.password
    });

  expect(res.statusCode).toBe(400); // you may need to validate and return 400 for bad input
  expect(res.body.status).toBe(false);
});

it("should fail when password is missing", async () => {
  const res = await request(app)
    .post("/api/login")
    .send({
      username: TEST_USER.username
    });

  expect(res.statusCode).toBe(400); // same here
  expect(res.body.status).toBe(false);
});
```

## Σύνδεση Frontend με Server

### Δημιουργία Δοκιμαστικού API Endpoint για Message
#### message.controller.js
```javascript
/**
 * @swagger
 * /api/message:
 *   get:
 *     summary: Get a welcome message from the server
 *     description: Returns a simple "Hello from the server" message
 *     responses:
 *       200:
 *         description: A welcome message
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Message
 */
exports.message = (req, res) => {
  try {
    res.status(200).json({
      status: true,
      message: "Hello from the server!"
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Internal server error"
    });
  }
}
```

#### message.routes.js
```javascript
const express = require('express')
const router = express.Router()
const messageController = require('../controllers/message.controller')

router.get ('/', messageController.message)

module.exports = router
```

#### Προσθήκη στο app.js
```javascript
const messageRoutes = require('./routes/message.routes.js')
app.use('/api/message', messageRoutes)
```

### Ενσωμάτωση API στο React App
#### app.jsx
```javascript
const [message, setMessage] = useState('')

useEffect(() => {
  axios.get('http://localhost:3000/api/message')
    .then(res => setMessage(res.data.message))
    .catch(err => console.error(err));
}, [])

return (
  <div>
    <h1>{message}</h1>
    {/* ... */}
  </div>
)
```

### Υλοποίηση Login Form και Frontend Authentication
#### app.jsx
```javascript
const url = 'http://localhost:3000/api'

const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [userIsAdmin, setUserIsAdmin] = useState(false)

const handleLogin = async (event) => {
  event.preventDefault()
  console.log("Submitting login...")

  try {
    const response = await axios.post(`${url}/login`, {
      "username": username,
      "password": password
    })
    console.log("Login successful", response.data)
    const { token, user } = response.data.data
    setUser(user)
    localStorage.setItem("token", token)
    localStorage.setItem("roles", JSON.stringify(user.roles))

    const isAdmin = user.roles.includes("admin")
    setUserIsAdmin(isAdmin)
    console.log("Is admin?", isAdmin)

  } catch (error) {
    console.log(error)     
  }
}

// Στο return
{user === null && 
  <LoginForm 
    username={username}
    password={password}
    setUsername={setUsername}
    setPassword={setPassword}
    handleLogin={handleLogin}
  />}
```

### Υλοποίηση Logout
#### userLogedInView.jsx
```javascript
const UserLogedInView = ({ handleLogout }) => {
  return (
    <>
      <h1>Welcome user</h1>
      <button onClick={handleLogout}>log out</button>
    </>
  )
}
export default UserLogedInView
```

#### app.jsx
```javascript
const handleLogout = async () => {
  localStorage.removeItem("token")
  setUser(null)
  setUserIsAdmin(false)
  console.log("Logged out successfully")
}

// Στο return
{user !==  null && 
  <UserLogedInView 
    handleLogout={handleLogout}
  />}
```

### Προσθήκη Admin Button στο UserLoggedInView
```javascript
// userLogedInView.jsx
{userIsAdmin &&
  <button onClick={handleAdminBtn}>admin panel</button> 
}

// app.jsx
<UserLogedInView 
  handleLogout={handleLogout}
  userIsAdmin={userIsAdmin}
  handleAdminBtn={handleAdminBtn}
/>
```

## Δημιουργία Admin Panel

### Δημιουργία Βασικού Admin Panel Component
#### frontend/src/components/AdminPanel.jsx
```javascript
const AdminPanel = () => {
  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Only admins can see this.</p>
    </div>
  )
}

export default AdminPanel
```

### Προσθήκη React Router
#### main.jsx
```javascript
import { BrowserRouter as Router } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
```

#### app.jsx
```javascript
import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from 'react-router-dom'

import AdminPanel from './components/AdminPanel'

const navigate = useNavigate()

const handleAdminBtn = () => {
  navigate("/admin")   
}

return (
  <div>
    <h6>{message}</h6>
    <h1>Login APP</h1>

    {/* Routes here handle sub-pages like /admin */}
    <Routes>
      <Route path="/" element={
        <>
          {user === null && 
          <LoginForm 
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />}
          {user !==  null && 
          <UserLogedInView 
            handleLogout={handleLogout}
            userIsAdmin={userIsAdmin}
            handleAdminBtn={handleAdminBtn}
          />}
        </>
      } /> 
      <Route path="/admin" element={<AdminPanel />} />        
    </Routes>
  </div>
)
```

### Περιορισμός Πρόσβασης στο Admin Panel Μόνο για Admins
#### src/services/ProtectedRoute.js
```javascript
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children, requiredRole }) => {
  if (!user) {
    return <Navigate to="/" />;
  }

  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
```

#### Ενημέρωση στο App.jsx για το Admin Route
```javascript
<Route path="/admin" element={
  <>
    <ProtectedRoute user={user} requiredRole="admin"></ProtectedRoute>
    <AdminPanel/>
  </>
} />
```

## Δημιουργία Χρήστη από το Admin Panel

### Προσθήκη URL στο AdminPanel
```javascript
// App.jsx
<Route path="/admin" element={
  <>
    <ProtectedRoute user={user} requiredRole="admin"></ProtectedRoute>
    <AdminPanel
      url={url}
    />
  </>
} />
```

### Ενημέρωση του AdminPanel.jsx
```javascript
import NewUserForm from './NewUserForm'
const AdminPanel = ({url}) => {
  // ...
  return (
    <div>
      {/* ... */}
      <button onClick={() => setViewForm(!viewForm)}>create user form</button>
      {viewForm && <NewUserForm url={url} />}
      {/* ... */}
    </div>
  )
}
```

### Δημιουργία NewUserForm.jsx
```javascript
import {useState} from 'react'
import axios from 'axios'

const NewUserForm = ({ url }) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roles, setRoles] = useState(['user'])

  const handleSubmitUser = async (event) => {
    event.preventDefault()
    
    try {
      const newUser = {
        "username": username,
        "name": name,
        "email": email,
        "password": password,
        "roles": roles
      }

      const response = await axios.post(`${url}/users`, newUser)

      console.log('✅ User created:', response.data)
      alert('User created successfully!')

      // Clear the form if needed
      setUsername('')
      setName('')
      setEmail('')
      setPassword('')
      setRoles(['user'])

    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmitUser}>
        <div>
          username
          <input type="text"
          value={username}
          name="username"
          onChange={({target}) => setUsername(target.value)}
          autoComplete="username"
          />
        </div>
        <div>
          name
          <input type="text"
          value={name}
          name="name"
          onChange={({target}) => setName(target.value)}
          autoComplete="name"
          />
        </div>
        <div>
          email
          <input type="email"
          value={email}
          name="email"
          onChange={({target}) => setEmail(target.value)}
          autoComplete="email"
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="admin"
              checked={roles.includes('admin')}
              onChange={({ target }) => {
                if (target.checked) {
                  setRoles([...roles, 'admin'])
                } else {
                  setRoles(roles.filter(r => r !== 'admin'))
                }
              }}
            />
            Admin
          </label>
        </div>      
        <div>
          password
          <input type="text"
          value={password}
          name="password"
          onChange={({target}) => setPassword(target.value)}
          autoComplete="password"
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </>
  )
}
export default NewUserForm
```

## Remember Login
### Διατήρηση Κατάστασης Σύνδεσης με Local Storage
```javascript
// App.jsx
useEffect(() => {
  const token = localStorage.getItem("token")
  const roles = JSON.parse(localStorage.getItem("roles"))
  if (token && roles) {
    const userFromStorage = { token, roles }
    setUser(userFromStorage) 
    setUserIsAdmin(roles.includes("admin")) 
  }
}, [])
```

## UI Improvements
### Προσθήκη Universal Logout Button
```javascript
// App.jsx
<h1>Login APP</h1>
{user && <button onClick={handleLogout}>log out</button>}
```

### Προσθήκη Home Button
```javascript
{/* Universal Home Button */}
<Link to="/" className="home-btn">
  <button>Home</button>
</Link>
```

## Προβολή Χρηστών στο Admin Panel
### AdminPanel.jsx - Προσθήκη Λειτουργικότητας Προβολής Χρηστών
```javascript
import { useState, useEffect } from "react"
import axios from 'axios'

const AdminPanel = ({ url }) => {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [viewForm, setViewForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get(`${url}/users`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setUsers(response.data.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); 
      }
    };

    fetchUsers();
  }, [url]);

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Only admins can see this.</p>
      {loading && <p>Loading...</p>}
      {!loading && users.length === 0 && <p>No users found</p>}
      <ul>
        {!loading && users.length !== 0 && 
          users.map((user) => {
            return (
              <li key={user.id}>
                {user.username} - {user.name} - {user.email} - {user.roles.join(", ")}
              </li>
            )
          })
        } 
      </ul>
      {/* ... */}
    </div>
  )
}
```

## Google Login Integration

### Διόρθωση Προβλημάτων στο Backend
#### Διόρθωση Διπλών Routes στο app.js
```javascript
app.use('/api/users', userRoutes)
app.use('/api/login', authRoutes)
// app.use('/api/auth', authRoutes) // Αφαιρέθηκε το διπλό route
app.use('/api/message', messageRoutes)
```

#### Ενημέρωση URL στο auth.routes.js
```javascript
// https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/login/google/callback&response_type=code&scope=email%20profile&access_type=offline
```

#### Ρύθμιση Google OAuth Origins και Redirects
```
Authorized JavaScript origins
http://localhost:3000
http://localhost:5173

Authorized redirect URIs
http://localhost:3000/api/login/google/callback
http://localhost:5173/
```

#### Διόρθωση auth.controller.js για το Google Login
```javascript
const jwt = require('jsonwebtoken');

exports.googleLogin = async(req, res) => {
  const code = req.query.code
  if (!code) {
    logger.warn('Auth code is missing during Google login attempt');
    res.status(400).json({status: false, data: "auth code is missing"})
  } 
  const { user, tokens } = await authService.googleAuth(code);

  if (!user || !user.email) {
    logger.warn('Google login failed or incomplete');
    return res.status(401).json({ status: false, data: "Google login failed" });
  }

  // 🔐 Create token for your app (JWT etc.)
  const dbUser = await User.findOneAndUpdate(
    { email: user.email },
    { $setOnInsert: { email: user.email, name: user.name, roles: ['user'] } },
    { upsert: true, new: true }
  );

  const payload = { id: dbUser._id, roles: dbUser.roles };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  return res.redirect(`http://localhost:5173/google-success?token=${token}&email=${dbUser.email}`);
}
```

### Προσθήκη Google Success Component στο Frontend
#### App.jsx
```javascript
import GoogleSuccess from './components/GoogleSuccess'

// ...
<Route path="/google-success" element={
  <GoogleSuccess setUser={setUser} setUserIsAdmin={setUserIsAdmin} />
} />
```

#### components/GoogleSuccess.jsx
```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (token) {
      // Store the token (adjust storage if you prefer memory/Redux/etc.)
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);

      // Redirect to dashboard or homepage
      navigate('/');
    } else {
      // Maybe show error
      navigate('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Logging you in via Google...</div>;
};

export default GoogleSuccess;
```

### Προσθήκη Google Login Button στο LoginForm
```javascript
// LoginForm.jsx
const googleUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/login/google/callback&response_type=code&scope=email%20profile&access_type=offline'

// Στο return
<a href={googleUrl}>
  <button type="button">Login with Google</button>
</a>
```

### Ενσωμάτωση Google OAuth Library
```bash
npm install @react-oauth/google
```

#### main.jsx
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'

const googleClientId = '37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
    <GoogleOAuthProvider clientId={googleClientId}> 
      <App />
      </GoogleOAuthProvider>
    </Router>
  </StrictMode>,
)
```

#### App.jsx
```javascript
const handleGoogleLogin = (response) => {
  console.log("Google login response:", response);
  // Send the Google token to your backend for verification
  axios.post(`${url}/login/google/callback`, {
    code: response.code
  }).then(res => {
    // Handle successful Google login (set user, token, etc.)
    console.log("Google login successful", res.data);
  }).catch(err => {
    console.log("Google login error", err);
  });
};

// Στο Route element
<LoginForm 
  username={username}
  password={password}
  setUsername={setUsername}
  setPassword={setPassword}
  handleLogin={handleLogin}
  handleGoogleLogin={handleGoogleLogin}
/>
```

#### LoginForm.jsx
```javascript
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin, handleGoogleLogin }) => {
  // ...
  return (
    <>
      {/* ... */}
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={(error) => console.log("Google Login Error:", error)}
      />
      {/* ... */}
    </>
  )
}
```

## User Detail Page

### components/UserDetail.jsx
```javascript
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();  // Access the id from the route parameter
  
  return (
    <div>
      <h4>User Detail for ID: {id}</h4>
      {/* Fetch and display user details here */}
    </div>
  );
};

export default UserDetail;
```

### AdminPanel.jsx
```javascript
              <li key={user._id || `${user.username}-${user.email}`}>
                 <Link to={`/users/${user._id}`}>
                  {user.username}
                 </Link>
                 - {user.name} - {user.email} - {user.roles.join(", ")}
              </li>
```
### App.jsx
```javascript
          <Route path="/users" element={<AdminPanel url={url} />} />
          <Route path="/users/:id" element={<UserDetail />} />
```

# επιπλέων user test με jest στο backend που ήταν εκρεμμότητα
## αρχικα πρέπει να κάνω αλλαγές στο user.controler.js Aρχικά ήταν:
```javascript
exports.findAll = async (req,res) => {
  const users = await userDAO.findAllUsers();
  res.json({ status: true, data: users });
}
```

### που είναι οκ αλλα χρειάζομαι να αλλάξει για να κανω τεστ για αποτυχία, και γίνετε 
```javascript
exports.findAll = async (req,res) => {
  try {

    if (!req.headers.authorization) {
      return res.status(401).json({ status: false, error: 'No token provided' });
    }

    const users = await userDAO.findAllUsers();
    res.status(200).json({ status: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal server error' });
  }

  // const users = await userDAO.findAllUsers();
  // res.json({ status: true, data: users });
}
```

## δημιουργώ το users.test.js

```javascript
const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const User = require("../models/users.models");
const userDAO = require("../daos/user.dao");

const authService = require('../services/auth.service')
const loginRouter = require('../routes/auth.routes')

const TEST_USER_ADMIN = {
  username: "testuser",
  name: "Test User",
  email: "testuser@example.com",
  password: "testpassword",
  roles: ["admin"]
};

let token;

beforeAll(async () => {

  const saltrounds = 10
  const hashedPassword = await bcrypt.hash(TEST_USER_ADMIN.password, saltrounds);

  await mongoose.connect(process.env.MONGODB_TEST_URI);
  console.log("Connection to MongoDB established for Jest")

  await User.deleteMany({})

  await User.create({
    username: TEST_USER_ADMIN.username,
    name: TEST_USER_ADMIN.name,
    email: TEST_USER_ADMIN.email,
    hashedPassword: hashedPassword,
    roles: TEST_USER_ADMIN.roles
  })

  const res = await request(app)
  .post("/api/login")
  .send({
    username: TEST_USER_ADMIN.username,
    password: TEST_USER_ADMIN.password
  });
  token = res.body.data.token
  console.log("token:", token)
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close();
});

describe('GET /api/users', () => {
  it('should return 200 and a list of users when authorized and is admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);  // Pass the token

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should return 400 when no token', async () => {
    const res = await request(app)
      .get('/api/users')

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(false);
  })

  it('should return 403 when a non-admin user tries to access the users list', async () => {
    // Simulate a non-admin user login
    const nonAdminToken = 'some-fake-token-for-non-admin';

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${nonAdminToken}`);

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(false);
  });
})

describe('POST /api/users', () => {
  it('should return 201 and the created user when valid data is provided', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      roles: ['user']
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.username).toBe(newUser.username);
    expect(res.body.name).toBe(newUser.name);
    expect(res.body.email).toBe(newUser.email);
    expect(res.body.roles).toEqual(newUser.roles);
  });

  it('should return 400 when required fields are missing', async () => {
    const newUser = {
      username: 'newuser',
      // Missing name, email, password, roles
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(res.status).toBe(500);
  });

  it('should return 400 when username already exists', async () => {
    const newUser = {
      username: 'existinguser',
      name: 'Existing User',
      email: 'existinguser@example.com',
      password: 'password123',
      roles: ['user']
    };

    // First, create a user with this username
    await request(app)
      .post('/api/users')
      .send(newUser);

    // Try to create the user again
    const res = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(res.status).toBe(400);
  });
});
```

## φτιαχνω ακόμα τεστ για το message.tes.js
```javascript
const request = require('supertest');
const app = require('../app'); // Your Express app

describe('GET /api/message', () => {
  it('should return 200 and a welcome message', async () => {
    const res = await request(app).get('/api/message');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: true,
      message: "Hello from the server!!"
    });
  });
});
```

## Αλλαγή στο package.json
### επηδή τα τα τεστ το καθένα μονο του πέρναγε κανονικά αλλά ολα μαζί κάνανε κονφλικτ προσθεσα το **--runΙnBand** στο σκριπτ ωστε να τρέχουν ένα ένα
```javascript
    "test": "cross-env NODE_ENV=test jest --testTimeout=50000  --runInBand"
```

## Delete user
## user.dao.js (θα το χρειαστώ σε λίγο) προσθέτω
```javascript
const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId)
}

module.exports = {
  findAllUsers,
  findUserByUsername,
  findUserByEmail,
  createUser,
  deleteUserById
};
```

## user.controller.js προσθέτω
```javascript
exports.deleteById = async (req, res) => {
  const userId = req.params.id
  if (!userId){
    return res.status(400).json({
      status: false,
      error: 'User ID is required OR not found'
    })
  }
  try {
    const deleteUser = await userDAO.deleteUserById(userId) // to be added to user.dao.js
    if (!deleteUser){
      return res.status(404).json({
        status: false,
        error: 'Error deleting user: not found'
      })
    } else {
      res.status(200).json({
        status: true,
        message: `User ${deleteUser.username} deleted successfully`,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    })
  }
}
```
### πρέπει να του βάλω απο πάνω και @swagger
```javascript
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Admin only. Deletes a user by ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Missing or invalid ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
```

## user.routes.js
```javascript
router.delete('/:id', verifyToken, checkRole('admin'), userController.deleteById)
```
### δοκιμή με postman ok
## προσθήκη jest test στο users.test.js
```javascript
  it('creates a user and then deletes it', async () => {
    const newUser = {
      username: 'deleteme',
      name: 'deleteme',
      email: 'deleteme@example.com',
      password: '123',
      roles: ['user']
    };

    // First, create a user with this username
    const toBeDeletedUser = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201)

    // try to retrive user id
    const userId = toBeDeletedUser.body._id
    expect(userId).toBeDefined()

    await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  });
  it('delete with no id expext 404', async () => {
    await request(app)
    .delete(`/api/users/`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
  })
  it('delete with invalid id expect 404', async () => {
    const justAWrongId = '60c72b2f9b1e8b1a8b2a3c4d' //invalid id but valid mongo format
    await request(app)
    .delete(`/api/users/${justAWrongId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
  })
  it('delete with invalid id expect 500', async () => {
    const justAWrongId = 'invalid id format' //invalid id and invalid mongo format
    await request(app)
    .delete(`/api/users/${justAWrongId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(500)
  })
```

# front end delete functionality
## App.jsx
```javascript
  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTimeout(() => {
        setMessage("User is deleted");
      }, 7000);
      console.log("User deleted", response.data);
    } catch (error) {
      console.error("Failed to delete user", error.response?.data || error.message);
    }
  };
```
#### στο return (προσθεσα τα handleDeleteUser)
```javascript
            <AdminPanel
              url={url}
              handleDeleteUser={handleDeleteUser}
            />
          </>
        } />  

        <Route path="/google-success" element={
          <GoogleSuccess setUser={setUser} setUserIsAdmin={setUserIsAdmin} />
        } />

        <Route path="/users" element={<AdminPanel handleDeleteUser={handleDeleteUser} url={url} />} />
        <Route path="/users/:id" element={<UserDetail />} />

```
## στο return του AdminPanel.jsx (εκει που δημιουργεί την λίστα)
```javascript
              <li key={user._id || `${user.username}-${user.email}`}>
                 <Link to={`/users/${user._id}`}>
                  {user.username}
                 </Link>
                 - {user.name} - {user.email} - {user.roles.join(", ")}
                 <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </li>
```

# Μικροπροβλημα με μη άμεσο responce στο render αν δημιουργώ ή σβήνω χρήστη
## στο App.jsx στην handleDeleteUser προσθεσα
```javascript
    const isConfirmed = window.confirm("Are you sure you want to delete this user?")
    if (!isConfirmed) {
      console.log("User deletion cancelled");
      return; // Exit the function if the user cancels
    }
// [...]
      alert('User deleted successfully!')
      // ✅ απλό "φρεσκάρισμα" της σελίδας για να ξανατραβήξει τα δεδομένα
      window.location.reload()
```

## και το ιδιο και στο NewUserForm.jsx στην handleSubmitUser
```javascript
      // ✅ απλό "φρεσκάρισμα" της σελίδας για να ξανατραβήξει τα δεδομένα
      window.location.reload()
```

# cypress tests
## /cypress
### npm init
### npm install --save-dev cypress
### στο Package του νεοφτιαγμένου αππ
```javascript
  "scripts": {
    "cypress:open": "cypress open"
```
### στο package του backend
```javascript
    "start:test": "NODE_ENV=test node index.js"
```
### στο package του frontend
#### αυτή είναι η εξήγηση του gpt: *Vite (by default) may bind to 127.0.0.1 or IPv6 ::1 only. Cypress might try to use localhost, which sometimes resolves differently (especially on Linux or WSL). Fix: Tell Vite to use 0.0.0.0 (bind to all interfaces):*
```javascript
"scripts": {
  "dev": "vite --host"
}
```
### When both the backend and frontend are running, we can start Cypress with the command απο το φάκελο του cypress 
- **npm run cypress:open** 
- create new spec 
- cypress\e2e\loginApp.cy.js

## notes\loginApp\cypress\cypress\e2e\loginApp.cy.js
#### αρχικά με αυτό βλέπω οτι το cypress Λειτουργεί 
```javascript
describe ('Login App', () =>{
const urlF = 'http://localhost:5173'
  it('page can be accesed', function() {
    cy.visit(urlF)
  })
})
```

## loginApp.cy.js
```javascript
describe ('Login App', () =>{

const urlB = 'http://localhost:3000'
const urlF = 'http://localhost:5173'
```
### για τα τεστ μου θα δημιουργήσω δύο χρηστες έναν αντμιν και έναν οχι. Στην αρχή θα πάρω τα τοκεν και τα id, για να τα χρησιμοποιήσω για να τους σβήσω στο τέλος του τεστ
```javascript
const user = {
  name: 'testerAdmin',
  username: 'testerAdmin',
  password: '123',
  email: 'admin@google.com',  // προσοχη το μεηλ ηταν υποχρεωτικο
  roles: ['admin']
}

const user2 = {
  name: 'tester',
  username: 'tester',
  password: '123',
  email: 'user2@google.com',
  roles: ['user']
}

let userIdAdmin = null
let tokenAdmin = null

let userId2 = null
let token2 = null

  before(() => {
    // για την δημιουργία του admin
    cy.request('POST', `${urlB}/api/users`, user)
      .then((res) => {
        userIdAdmin = res.body._id
        expect(userIdAdmin).to.exist
        console.log('userId:', userIdAdmin);
      })
    cy.request('POST', `${urlB}/api/login`, {
      username:user.username,
      password:user.password
    })
      .then((res) => {
        tokenAdmin = res.body.data.token
        expect(tokenAdmin).to.exist
        console.log('token:', tokenAdmin)        
      })
    
    cy.wait(500)

    // για την δημιουργία του user2
    cy.request('POST', `${urlB}/api/users`, user2)
      .then((res) => {
        userId2 = res.body._id
        expect(userId2).to.exist
        console.log('user2Id:', userId2);
      })
    cy.request('POST', `${urlB}/api/login`, {
      username:user2.username,
      password:user2.password
    })
      .then((res) => {
        token2 = res.body.data.token
        expect(token2).to.exist
        console.log('token2:', token2)        
      })
  })

  after(() => {
    console.log('TokenAdmin for delete request:', tokenAdmin)
    cy.request({
      method: 'DELETE',
      url: `${urlB}/api/users/${userIdAdmin}`,
      headers: {
        Authorization: `Bearer ${tokenAdmin}`
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
    })

    cy.wait(500)

    cy.request({
      method: 'DELETE',
      url: `${urlB}/api/users/${userId2}`,
      headers: {
        Authorization: `Bearer ${tokenAdmin}`
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
```

## προσθέτω id στα διαφορα element του LoginForm.jsx
```javascript
//App.jsx
          id='home'
//LoginForm.jsx
          id="username"
          id="password"
          id="loginBtn"
//UserLogedinView
          id="logoutBtn"
          id="adminBtn"
// AdminPanel.jsx
          id={`${user.username}Btn`}  //προσοχή
          id="createUserBtn"
// NewUserForm.jsx
          id='createUsername'
          id='createName'
          id='createEmail'
          id='createPassword'
          id='submitCreateBtn'

```
### διαφορα τεστ
```javascript
  it('page can be accesed', function() {
    cy.visit(urlF)
    cy.contains('Login APP')
    cy.contains('login')
    cy.contains('username').should('exist')
    cy.contains('password').should('exist')
    cy.get('form').should('exist')
  })

  it('succeeds with correct credentials', function () {
    cy.visit(urlF) 
    cy.get('#username').type('tester')
    cy.get('#password').type('123')
    cy.get('#loginBtn').click()
    cy.contains('Welcome user')
    cy.get('#adminBtn').should('not.exist')
    cy.get('#logoutBtn').click()
  })

  it('succeeds with admin credentials and can do admin oparations', function () {
    cy.visit(urlF) 
    cy.get('#username').type('testerAdmin')
    cy.get('#password').type('123')
    cy.get('#loginBtn').click()
    cy.contains('Welcome user')
    cy.get('#adminBtn').should('exist')
    cy.get('#adminBtn').click()
    cy.get('#createUserBtn').click()
    cy.get('#createUsername').type('DeleteMe')
    cy.get('#createName').type('DeleteMe')
    cy.get('#createEmail').type('DeleteMe@junkmail.com')
    cy.get('#createPassword').type('123')
    cy.wait(500)
    cy.get('#submitCreateBtn').click()
    cy.wait(5000)
    cy.get('#adminBtn').click()
    cy.wait(5000)
    cy.get('#DeleteMeBtn').should('exist')
    cy.get('#DeleteMeBtn').click()
    cy.wait(5000)
    cy.get('#adminBtn').click()
    cy.wait(5000)
    cy.contains('DeleteMe').should('not.exist')
    // cy.wait(5000)
    // cy.get('#logoutBtn').click()
  })
```

## τα τεστ τρέχουν με
```
npm run cypress:open
```

# **Deploy**

### στο .gitignore αντικαθηστω το dist με 
```
# Ignore the dist inside frontend
notes/loginApp/frontend/dist/

# But don't ignore the dist inside loginApp (force include)
!notes/loginApp/dist/
```

### https://dashboard.render.com
- +create new service
- web services
- -> git provider -> https://github.com/alkisax/loginAPP -> credentials -> alkisax -> configure in github -> authenticate -> loginAPP
- Free
- Προσθηκη .env variables
-- MONGODB_URI
-- SECRET
-- JWT_SECRET
-- GOOGLE_CLIENT_ID
-- GOOGLE_CLIENT_SECRET
-- REDIRECT_URI
-- APP_URL
- Deploy web service
- setings
-- (start command 'npm start')

# αλλαγή των Url
## App.js
```
const url = 'https://loginapp-tjlf.onrender.com/api'
```

# ***ERROR*** runs only when local back open
# ***IMPORTANT*** *απο εδώ και πέρα ολες οι αλλαγες στο front απαιτουν nmp run build, αλλαγή των φακέλων dist και νέο git push*

#### Απο το chatGPT: When you call: window.location.reload() It forces a full-page reload, and React Router tries to resolve the route (e.g., /admin) by making a direct GET request to the server (https://loginapp-tjlf.onrender.com/admin). But your backend doesn’t have a route for /admin, because it's a frontend-only route managed by React Router — hence the 404 error
## App.jsx
```javascript
  const [users, setUsers] = useState([])
//[...]
  const handleDeleteUser = async (userId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?")
    if (!isConfirmed) {
      console.log("User deletion cancelled");
      return; // Exit the function if the user cancels
    }
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTimeout(() => {
        setMessage("User is deleted");
      }, 7000);
      console.log("User deleted", response.data);
      alert('User deleted successfully!')

      // ✅ απλό "φρεσκάρισμα" της σελίδας για να ξανατραβήξει τα δεδομένα
      // window.location.reload()
      setUsers(users.filter(user => user.id !== userId)); // αυτο προστεθηκε γιατι δεν πρεπει να κανεις ανανεωση της σελιδας σε single page app

    } catch (error) {
      console.error("Failed to delete user", error.response?.data || error.message);
    }
  };
// [...]
            <AdminPanel
              url={url}
              handleDeleteUser={handleDeleteUser}
              users={users}
              setUsers={setUsers}
            />
```
## AdminPanel.jsx
```javascript
const AdminPanel = ({url, handleDeleteUser, users, setUsers}) => {
// [...]
      <button id="createUserBtn" onClick={() => setViewForm(!viewForm)}>create user form</button>
      {viewForm && <NewUserForm users={users} setUsers={setUsers} url={url} />}
```
## NewUserForm.jsx
```javascript
const NewUserForm = ({ url, users, setUsers }) =>{
// [...]
  const handleSubmitUser = async (event) => {
    event.preventDefault()
    
    try {
      const newUser = {
        "username": username,
        "name": name,
        "email": email,
        "password": password,
        "roles": roles
      }

      const response = await axios.post(`${url}/users`, newUser)

      console.log('✅ User created:', response.data)
      alert('User created successfully!')

      // Clear the form if needed
      setUsername('')
      setName('')
      setEmail('')
      setPassword('')
      setRoles(['user'])

      // Redirect to /admin after creating the user
      // navigate('/admin');
      // ✅ απλό "φρεσκάρισμα" της σελίδας για να ξανατραβήξει τα δεδομένα
      // window.location.reload()
      // Update users list directly
      setUsers([...users, response.data]); // αυτο προστεθηκε γιατι δεν πρεπει να κανεις ανανεωση της σελιδας σε single page app

    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

```
# **ERROR** google login URI points local
## App.jsx
```javascript
            <LoginForm 
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={handleLogin}
              url={url} // περνάω το url
            />}
```
## LoginForm.jsx
```javascript
  // const googleUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/login/google/callback&response_type=code&scope=email%20profile&access_type=offline'
  const googleUrl = `https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=${url}/login/google/callback&response_type=code&scope=email%20profile&access_type=offline`;
```

## στο https://console.cloud.google.com/auth/clients/
- Authorized redirect URIs
-- http://localhost:3000/api/login/google/callback
-- http://localhost:5173/
-- https://loginapp-tjlf.onrender.com/api/login/google/callback

## στο render -> enviroment
REDIRECT_URI=https://loginapp-tjlf.onrender.com/api/login/google/callback

## αποθηκεύω το νέο google log in στο auth.routes.js
// https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=https://loginapp-tjlf.onrender.com/api/login/google/callback&response_type=code&scope=email%20profile&access_type=offline

# fix Cannot GET /google-success
# fix /admin refresh
# ***ΘΕΛΕΙ ΕΞΗΓΗΣΗ ΓΙΑΤΙ ΑΠΛΟΣ ΤΟ ΠΕΙΡΑ ΑΠΟ ΤΟ GPT**
## στο app.js στο back προσθέτω
```javascript
const path = require('path'); // requires explanation. added for rendering front page subpages
// [...]
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({
     error: 'API route not found'
    }); // requires explanation. added for rendering front page subpages

  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```
# delete does not rerender
## στο App.jsx αλλαξε απλώς το user.id σε user._id
```
      setUsers(users.filter(user => user._id !== userId));
```

## ***TODO remove hardcoded Url from auth.controller.js and create FRONTEND_URL env variable ***
### στο .env και στα enviroment του Render
```
FRONTEND_URL=https://loginapp-tjlf.onrender.com
```
## στο auth.controller.js
  const frontendUrl = process.env.FRONTEND_URL
  return res.redirect(`${frontendUrl}/google-success?token=${token}&email=${dbUser.email}`);


# change in loginApp.cy.js
```
// const urlB = 'http://localhost:3000'
// const urlF = 'http://localhost:5173'
const urlB = 'https://loginapp-tjlf.onrender.com'
const urlF = 'https://loginapp-tjlf.onrender.com'
```
### αφαιρέθηκαν μερικές γραμμες γιατι ήταν πια περιτές λογο του rerender
```
    // cy.wait(5000)
    // cy.get('#adminBtn').click()
```
## τα τεστ τρέχουν απο το φακελο του cypress με npm run cypress:open



