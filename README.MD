Οδηγός δημιουργίας Full-Stack εφαρμογής Login με MERN Stack
Αυτός ο οδηγός περιγράφει βήμα προς βήμα τη διαδικασία δημιουργίας μιας εφαρμογής login χρησιμοποιώντας τις τεχνολογίες του MERN stack (MongoDB, Express, React, Node.js).
Περιεχόμενα

Αρχικοποίηση Git Repository
Εγκατάσταση και ρύθμιση του Frontend (React)
Εγκατάσταση και ρύθμιση του Backend (Express)
Δημιουργία βασικής δομής του Backend
Δημιουργία του Frontend Login Form
Υλοποίηση CRUD λειτουργιών
Διαχείριση χρηστών και κωδικών πρόσβασης
Υλοποίηση JWT Authentication
Υλοποίηση Google Authentication
Προχωρημένες λειτουργίες
Δοκιμή της εφαρμογής

Αρχικοποίηση Git Repository
Εδώ δημιουργούμε και συνδέουμε το τοπικό μας repository με το απομακρυσμένο στο GitHub για έλεγχο έκδοσης και διευκόλυνση της συνεργασίας.
bash# Δημιουργία τοπικού repository
git init

# Σύνδεση με το απομακρυσμένο repository στο GitHub
git remote add origin git@github.com:alkisax/loginAPP.git

# Λήψη του περιεχομένου από το απομακρυσμένο repository
git pull origin main
Εγκατάσταση και ρύθμιση του Frontend (React)
Σε αυτό το βήμα δημιουργούμε το React project χρησιμοποιώντας το Vite και εγκαθιστούμε τις απαραίτητες βιβλιοθήκες για το frontend της εφαρμογής. Το Redux θα χρησιμοποιηθεί για διαχείριση καταστάσεων, ενώ το axios για επικοινωνία με το backend.
bash# Δημιουργία νέου React project με Vite
npm create vite@latest frontend -- --template react

# Μετακίνηση στον κατάλογο του frontend
cd frontend

# Εγκατάσταση των βασικών εξαρτήσεων
npm install

# Εγκατάσταση των επιπρόσθετων βιβλιοθηκών
npm install axios               # Για HTTP αιτήματα
npm install react-bootstrap     # Για στυλιστικά components
npm install react-router-dom    # Για δρομολόγηση στο frontend
npm install redux               # Διαχείριση καταστάσεων
npm install react-redux         # Σύνδεση React με Redux
npm install @reduxjs/toolkit    # Εργαλεία για απλοποίηση χρήσης του Redux
Εγκατάσταση και ρύθμιση του Backend (Express)
Εδώ δημιουργούμε το Express backend και εγκαθιστούμε τις απαραίτητες βιβλιοθήκες. Το mongoose θα χρησιμοποιηθεί για τη σύνδεση με τη MongoDB, το bcrypt για κρυπτογράφηση κωδικών, και το jsonwebtoken για την αυθεντικοποίηση.
bash# Δημιουργία φακέλου για το backend (αν δεν βρισκόμαστε ήδη στον γονικό φάκελο)
cd ..

# Αρχικοποίηση του Node.js project
npm init

# Εγκατάσταση βασικών βιβλιοθηκών
npm install express             # Web framework
npm install mongoose            # MongoDB ODM
npm install dotenv              # Διαχείριση μεταβλητών περιβάλλοντος
npm install bcrypt              # Κρυπτογράφηση κωδικών
npm install jsonwebtoken        # Διαχείριση JWT tokens
npm install swagger-ui-express  # API documentation
npm install mongoose-to-swagger # Μετατροπή mongoose models σε swagger schemas
npm install winston             # Logging
npm install winston-daily-rotate-file # Περιστροφή αρχείων καταγραφής
npm install winston-mongodb     # Logging στη MongoDB
npm install google-auth-library # Αυθεντικοποίηση με Google
npm install axios               # HTTP client
npm install cors                # Cross-Origin Resource Sharing
npm install morgan              # HTTP request logger
npm install express-async-errors # Χειρισμός σφαλμάτων ασύγχρονων λειτουργιών
npm install prop-types          # Type checking για React props

# Εγκατάσταση εξαρτήσεων για ανάπτυξη
npm install --save-dev nodemon  # Αυτόματη επανεκκίνηση του server
npm install --save-dev supertest # Για testing HTTP
npm install --save-dev cross-env # Διαχείριση μεταβλητών περιβάλλοντος
npm install --save-dev jest @babel/preset-env @babel/preset-react eslint-plugin-jest # Για testing
npm install --save-dev deep-freeze # Για immutable objects στα tests
Σημείωση: Αν αντιμετωπίσετε πρόβλημα με το express-async-errors, μπορείτε να κάνετε downgrade του express:
bashnpm install express@4
Δημιουργία βασικής δομής του Backend
Σε αυτή την ενότητα θα δημιουργήσουμε τη βασική δομή του backend με τη ρύθμιση του server, τη σύνδεση με τη MongoDB και το σχεδιασμό του API μας.
1. Δημιουργία αρχείου περιβάλλοντος
Το .env αρχείο περιέχει ευαίσθητες πληροφορίες όπως συνδέσεις με βάσεις δεδομένων που δεν πρέπει να αποθηκεύονται στο version control.
Δημιουργήστε ένα αρχείο .env στον κεντρικό φάκελο του backend:
MONGODB_URI = mongodb+srv://username:password@cluster0.example.mongodb.net/loginApp?retryWrites=true&w=majority
SECRET = yourSecretKeyForJWT
GOOGLE_CLIENT_ID = yourGoogleClientId
GOOGLE_CLIENT_SECRET = yourGoogleClientSecret
REDIRECT_URI = http://localhost:3000/api/auth/google/callback
2. Οργάνωση του backend κώδικα
Η σωστή οργάνωση του κώδικα είναι σημαντική για τη συντηρησιμότητα και την επεκτασιμότητα της εφαρμογής.
Δημιουργήστε τους ακόλουθους φακέλους:

models: Για τα mongoose models
controllers: Για τους controllers του API
routes: Για τα endpoints του API
services: Για την επιχειρηματική λογική της εφαρμογής

3. Προσθήκη scripts στο package.json
Τα scripts στο package.json διευκολύνουν την εκτέλεση συχνών εργασιών όπως την εκκίνηση του server.
Προσθέστε τα παρακάτω scripts στο package.json:
json"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
4. Δημιουργία του μοντέλου User
Το μοντέλο User ορίζει τη δομή των δεδομένων χρήστη στη MongoDB και περιλαμβάνει πεδία για το όνομα χρήστη, το όνομα, τους ρόλους, το email και τον κωδικό πρόσβασης.
Δημιουργήστε το αρχείο models/users.models.js:
javascriptconst mongoose = require("mongoose")
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
  hashedPassword:{
    type: String,
    required: [true, 'password is required'],
  },
},
{
  collection: 'users',
  timestamps: true
})
module.exports = mongoose.model('User', userSchema)
5. Δημιουργία του User Controller
Ο controller περιέχει τις λειτουργίες που χειρίζονται τα HTTP αιτήματα για τους χρήστες.
Δημιουργήστε το αρχείο controllers/user.controller.js:
javascriptconst User = require('../models/users.models')
const bcrypt = require('bcrypt')
const authService = require('../services/auth.service')

exports.findAll = async (req,res) => {
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

  const results = await User.find()
  res.json({
    status: true,
    data: results
  })
}

exports.create = async (req,res) => {
  const username = req.body.username
  const name = req.body.name
  const password = req.body.password
  const email = req.body.email
  const roles = req.body.roles

  const saltOrRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltOrRounds)

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
6. Δημιουργία των User Routes
Τα routes καθορίζουν τα URL endpoints και τους αντίστοιχους controllers για κάθε HTTP λειτουργία.
Δημιουργήστε το αρχείο routes/user.routes.js:
javascriptconst express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller.js')

router.get('/', userController.findAll)
router.post('/', userController.create)

module.exports = router
7. Δημιουργία του κεντρικού server
Το αρχείο server.js είναι το σημείο εκκίνησης της εφαρμογής backend και ρυθμίζει το Express, τη σύνδεση με τη MongoDB, και τα routes.
Δημιουργήστε το αρχείο server.js:
javascriptrequire('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user.routes.js')
const authRoutes = require('./routes/auth.routes.js')
const { log } = require('winston')

const app = express()
app.use(cors())
app.use(express.static('dist')) // για σερβίρισμα του React build
app.use(express.json());

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use('/api/users', userRoutes)
app.use('/api/login', authRoutes)
app.use('/api/auth', authRoutes)

// Εκκίνηση του server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app
Δημιουργία του Frontend Login Form
Το login form είναι το βασικό συστατικό του frontend και επιτρέπει στους χρήστες να εισάγουν τα στοιχεία τους.
jsxreturn (
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
      <button type="submit">Login</button>
    </form>
  </>
)
Προσθήκη Custom View για συνδεδεμένους χρήστες
Προσθέτουμε ένα component που θα εμφανίζεται όταν ο χρήστης είναι συνδεδεμένος.
Δημιουργήστε το αρχείο components/userLogedInView.jsx:
jsxconst UserLogedInView = () => {
  return (
    <>
      <h1>Welcome user</h1>
    </>
  )
}
export default UserLogedInView
Και τροποποιήστε το App.jsx:
jsximport { useState } from 'react'
import LoginForm from './components/LoginForm'
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

export default App
Υλοποίηση CRUD λειτουργιών
Για να δοκιμάσουμε την εφαρμογή, χρειαζόμαστε τη δυνατότητα δημιουργίας χρηστών, που υλοποιήθηκε παραπάνω με τη λειτουργία POST.
Διαχείριση χρηστών και κωδικών πρόσβασης
Σε αυτό το βήμα, τροποποιούμε το μοντέλο χρήστη για να αποθηκεύουμε κωδικούς πρόσβασης με ασφάλεια, χρησιμοποιώντας το bcrypt για κρυπτογράφηση.
Μετατροπή του πεδίου password σε hashedPassword
Αυτή η αλλαγή είναι κρίσιμη για την ασφάλεια, καθώς δεν αποθηκεύουμε ποτέ τους κωδικούς πρόσβασης σε απλό κείμενο στη βάση δεδομένων.
Υλοποίηση JWT Authentication
Το JSON Web Token (JWT) παρέχει έναν ασφαλή τρόπο για την αυθεντικοποίηση των χρηστών μεταξύ των αιτημάτων. Σε αυτό το τμήμα, δημιουργούμε τις υπηρεσίες αυθεντικοποίησης και το endpoint για το login.
1. Δημιουργία του Auth Service
Το auth service παρέχει λειτουργίες για την παραγωγή και επαλήθευση των JWT tokens και την επαλήθευση κωδικών πρόσβασης.
Δημιουργήστε το αρχείο services/auth.service.js:
javascriptconst jwt = require('jsonwebtoken')
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

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

module.exports = {
  generateAccessToken,
  verifyPassword,
  verifyAccessToken,
  getTokenFrom
}
2. Δημιουργία του Auth Controller
Ο auth controller χειρίζεται τα αιτήματα login και επιστρέφει ένα JWT token αν η αυθεντικοποίηση είναι επιτυχής.
Δημιουργήστε το αρχείο controllers/auth.controller.js:
javascriptconst User = require('../models/users.models')
const authService = require('../services/auth.service')

exports.login = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    
    if (!user) {
      return res.status(401).json({
        status: false,
        error: 'Invalid username or password'
      })
    }
    
    const passwordCorrect = await authService.verifyPassword(password, user.hashedPassword)
    
    if (!passwordCorrect) {
      return res.status(401).json({
        status: false,
        error: 'Invalid username or password'
      })
    }
    
    const token = authService.generateAccessToken(user)
    
    res.status(200).json({
      status: true,
      data: {
        token,
        user: {
          username: user.username,
          email: user.email,
          roles: user.roles,
          id: user._id
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    })
  }
}
3. Δημιουργία των Auth Routes
Τα auth routes παρέχουν τα endpoints για login και άλλες λειτουργίες αυθεντικοποίησης.
Δημιουργήστε το αρχείο routes/auth.routes.js:
javascriptconst express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/', authController.login)
router.get('/google/callback', authController.googleLogin)

module.exports = router
Υλοποίηση Google Authentication
Σε αυτό το τμήμα, προσθέτουμε υποστήριξη για login με Google, χρησιμοποιώντας το OAuth 2.0.
1. Ρύθμιση των Google OAuth Credentials
Για να χρησιμοποιήσετε το Google OAuth, πρέπει να δημιουργήσετε ένα project στο Google Cloud Platform και να αποκτήσετε τα client credentials.

Επισκεφθείτε το https://cloud.google.com/gcp
Μεταβείτε στην κονσόλα
Επιλέξτε ή δημιουργήστε νέο project
Πηγαίνετε στο API και services > Credentials
Δημιουργήστε νέο OAuth client ID
Επιλέξτε "Web application"
Ορίστε το redirect URI ως: http://localhost:3000/api/auth/google/callback

2. Προσθήκη των Google Credentials στο .env
Προσθέστε τα client credentials που λάβατε από το Google στο .env αρχείο.
3. Υλοποίηση του Google Login Controller
Προσθέστε την ακόλουθη μέθοδο στο controllers/auth.controller.js:
javascriptexports.googleLogin = async(req, res) => {
  const code = req.query.code
  if (!code) {
    res.status(400).json({status: false, data: "auth code is missing"})
  } else {
    let user = await authService.googleAuth(code)
    return res.redirect('http://localhost:5173') // Ανακατεύθυνση στο frontend μετά την επιτυχή αυθεντικοποίηση
  }
}
4. Υλοποίηση του Google Auth Service
Προσθέστε την ακόλουθη μέθοδο στο services/auth.service.js:
javascriptconst { OAuth2Client } = require('google-auth-library')

const googleAuth = async (code) => {
  console.log("Google login", code);
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID
    });

    const userInfo = await ticket.getPayload();
    console.log("Google User", userInfo);
    return {user: userInfo, tokens}
  } catch (error) {
    console.log("Error in google authentication", error);
    return { error: "Failed to authenticate with google"}
  }
}

module.exports = {
  // ...τα προηγούμενα exports...
  googleAuth
}
5. Google OAuth Authorization URL
Για να αρχίσει η διαδικασία login με Google, ο χρήστης πρέπει να ανακατευθυνθεί σε ένα URL της Google. Το URL έχει τη μορφή:
https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile&access_type=offline
Προχωρημένες λειτουργίες
Μετά την ολοκλήρωση των βασικών λειτουργιών, μπορείτε να προσθέσετε προχωρημένες λειτουργίες για τη βελτίωση της εφαρμογής.
Προτεινόμενες επεκτάσεις:

Middleware για έλεγχο πρόσβασης βάσει ρόλων:

Διαχωρίστε τη λογική ελέγχου πρόσβασης από τους controllers σε middleware


Unit και Integration Tests:

Γράψτε Jest/Supertest tests για το API


Admin Panel:

Δημιουργήστε ένα ελάχιστο admin panel για τη διαχείριση χρηστών


Αποθήκευση Token στον Browser:

Αποθηκεύστε το JWT token στο localStorage ή σε cookie για διατήρηση της συνεδρίας


Προσθήκη σελίδων με React Router:

Δημιουργήστε επιπλέον σελίδες για προφίλ χρήστη, διαχείριση λογαριασμού, κλπ.


Swagger Documentation:

Προσθέστε Swagger για την τεκμηρίωση του API



Δοκιμή της εφαρμογής
Χρησιμοποιώντας το Postman, μπορούμε να δοκιμάσουμε τα API endpoints μας για να βεβαιωθούμε ότι λειτουργούν σωστά.
Δοκιμή του endpoint δημιουργίας χρήστη:

Ξεκινήστε το server:
bashnpm run dev

Στο Postman, κάντε ένα POST request στο http://localhost:3000/api/users με JSON σώμα:
json{
  "username": "testuser",
  "name": "Test User",
  "roles": ["user"],
  "email": "test@example.com",
  "password": "testpassword"
}

Επαληθεύστε ότι λαμβάνετε μια απάντηση με status 201 και τα δεδομένα του νέου χρήστη.

Δοκιμή του endpoint login:

Στο Postman, κάντε ένα POST request στο http://localhost:3000/api/login με JSON σώμα:
json{
  "username": "testuser",
  "password": "testpassword"
}

Επαληθεύστε ότι λαμβάνετε μια απάντηση με status 200 και ένα JWT token μαζί με βασικές πληροφορίες χρήστη.

Δοκιμή του προστατευμένου endpoint:

Κάντε ένα GET request στο http://localhost:3000/api/users
Στην καρτέλα "Headers", προσθέστε ένα header με key "Authorization" και value "Bearer YOUR_TOKEN"
Επαληθεύστε ότι λαμβάνετε μια απόκριση με status 200 και μια λίστα χρηστών εάν έχετε δικαιώματα admin

<!-- # Οδηγός δημιουργίας Full-Stack εφαρμογής Login με MERN Stack

Αυτός ο οδηγός περιγράφει βήμα προς βήμα τη διαδικασία δημιουργίας μιας εφαρμογής login χρησιμοποιώντας τις τεχνολογίες του MERN stack (MongoDB, Express, React, Node.js).

## Περιεχόμενα
1. [Αρχικοποίηση Git Repository](#αρχικοποίηση-git-repository)
2. [Εγκατάσταση και ρύθμιση του Frontend (React)](#εγκατάσταση-και-ρύθμιση-του-frontend-react)
3. [Εγκατάσταση και ρύθμιση του Backend (Express)](#εγκατάσταση-και-ρύθμιση-του-backend-express)
4. [Δημιουργία βασικής δομής του Backend](#δημιουργία-βασικής-δομής-του-backend)
5. [Δημιουργία του Frontend Login Form](#δημιουργία-του-frontend-login-form)
6. [Υλοποίηση CRUD λειτουργιών](#υλοποίηση-crud-λειτουργιών)
7. [Δοκιμή της εφαρμογής](#δοκιμή-της-εφαρμογής)

## Αρχικοποίηση Git Repository

_Εδώ δημιουργούμε και συνδέουμε το τοπικό μας repository με το απομακρυσμένο στο GitHub για έλεγχο έκδοσης και διευκόλυνση της συνεργασίας._

```bash
# Δημιουργία τοπικού repository
git init

# Σύνδεση με το απομακρυσμένο repository στο GitHub
git remote add origin git@github.com:alkisax/loginAPP.git

# Λήψη του περιεχομένου από το απομακρυσμένο repository
git pull origin main
```

## Εγκατάσταση και ρύθμιση του Frontend (React)

_Σε αυτό το βήμα δημιουργούμε το React project χρησιμοποιώντας το Vite και εγκαθιστούμε τις απαραίτητες βιβλιοθήκες για το frontend της εφαρμογής. Το Redux θα χρησιμοποιηθεί για διαχείριση καταστάσεων, ενώ το axios για επικοινωνία με το backend._

```bash
# Δημιουργία νέου React project με Vite
npm create vite@latest frontend -- --template react

# Μετακίνηση στον κατάλογο του frontend
cd frontend

# Εγκατάσταση των βασικών εξαρτήσεων
npm install

# Εγκατάσταση των επιπρόσθετων βιβλιοθηκών
npm install axios               # Για HTTP αιτήματα
npm install react-bootstrap     # Για στυλιστικά components
npm install redux               # Διαχείριση καταστάσεων
npm install react-redux         # Σύνδεση React με Redux
npm install @reduxjs/toolkit    # Εργαλεία για απλοποίηση χρήσης του Redux
```

## Εγκατάσταση και ρύθμιση του Backend (Express)

_Εδώ δημιουργούμε το Express backend και εγκαθιστούμε τις απαραίτητες βιβλιοθήκες. Το mongoose θα χρησιμοποιηθεί για τη σύνδεση με τη MongoDB, το bcrypt για κρυπτογράφηση κωδικών, και το jsonwebtoken για την αυθεντικοποίηση._

```bash
# Δημιουργία φακέλου για το backend (αν δεν βρισκόμαστε ήδη στον γονικό φάκελο)
cd ..

# Αρχικοποίηση του Node.js project
npm init

# Εγκατάσταση βασικών βιβλιοθηκών
npm install express             # Web framework
npm install mongoose            # MongoDB ODM
npm install dotenv              # Διαχείριση μεταβλητών περιβάλλοντος
npm install bcrypt              # Κρυπτογράφηση κωδικών
npm install jsonwebtoken        # Διαχείριση JWT tokens
npm install swagger-ui-express  # API documentation
npm install mongoose-to-swagger # Μετατροπή mongoose models σε swagger schemas
npm install winston             # Logging
npm install winston-daily-rotate-file # Περιστροφή αρχείων καταγραφής
npm install winston-mongodb     # Logging στη MongoDB
npm install google-auth-library # Αυθεντικοποίηση με Google
npm install axios               # HTTP client
npm install react-router-dom    # Δρομολόγηση για React
npm install cors                # Cross-Origin Resource Sharing
npm install morgan              # HTTP request logger
npm install express-async-errors # Χειρισμός σφαλμάτων ασύγχρονων λειτουργιών
npm install prop-types          # Type checking για React props

# Εγκατάσταση εξαρτήσεων για ανάπτυξη
npm install --save-dev nodemon  # Αυτόματη επανεκκίνηση του server
npm install --save-dev supertest # Για testing HTTP
npm install --save-dev cross-env # Διαχείριση μεταβλητών περιβάλλοντος
npm install --save-dev jest @babel/preset-env @babel/preset-react eslint-plugin-jest # Για testing
npm install --save-dev deep-freeze # Για immutable objects στα tests
```

**Σημείωση**: Αν αντιμετωπίσετε πρόβλημα με το `express-async-errors`, μπορείτε να κάνετε downgrade του express:

```bash
npm install express@4
```

## Δημιουργία βασικής δομής του Backend

_Σε αυτή την ενότητα θα δημιουργήσουμε τη βασική δομή του backend με τη ρύθμιση του server, τη σύνδεση με τη MongoDB και το σχεδιασμό του API μας._

### 1. Δημιουργία αρχείου περιβάλλοντος

_Το .env αρχείο περιέχει ευαίσθητες πληροφορίες όπως συνδέσεις με βάσεις δεδομένων που δεν πρέπει να αποθηκεύονται στο version control._

Δημιουργήστε ένα αρχείο `.env` στον κεντρικό φάκελο του backend:

```
MONGODB_URI = mongodb+srv://alkis:2102011895@cluster0.8ioq6.mongodb.net/loginAp?retryWrites=true&w=majority&appName=Cluster0
```

### 2. Οργάνωση του backend κώδικα

_Η σωστή οργάνωση του κώδικα είναι σημαντική για τη συντηρησιμότητα και την επεκτασιμότητα της εφαρμογής._

Δημιουργήστε τους ακόλουθους φακέλους:
- `models`: Για τα mongoose models
- `controllers`: Για τους controllers του API
- `routes`: Για τα endpoints του API
- `services`: Για την επιχειρηματική λογική της εφαρμογής

### 3. Προσθήκη scripts στο package.json

_Τα scripts στο package.json διευκολύνουν την εκτέλεση συχνών εργασιών όπως την εκκίνηση του server._

Προσθέστε τα παρακάτω scripts στο `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

### 4. Δημιουργία του μοντέλου User

_Το μοντέλο User ορίζει τη δομή των δεδομένων χρήστη στη MongoDB και περιλαμβάνει πεδία για το όνομα χρήστη και τον κωδικό πρόσβασης._

Δημιουργήστε το αρχείο `models/users.models.js`:

```javascript
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
  username:{
    type: String,
    required: [true, 'username is required'],
    unique:true
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

### 5. Δημιουργία του User Controller

_Ο controller περιέχει τις λειτουργίες που χειρίζονται τα HTTP αιτήματα για τους χρήστες._

Δημιουργήστε το αρχείο `controllers/user.controller.js`:

```javascript
const User = require('../models/users.models')

exports.findAll = async (req,res) => {
 const results = await User.find()
 res.json(results)
}
```

### 6. Δημιουργία των User Routes

_Τα routes καθορίζουν τα URL endpoints και τους αντίστοιχους controllers για κάθε HTTP λειτουργία._

Δημιουργήστε το αρχείο `routes/user.routes.js`:

```javascript
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller.js')

router.get ('/', userController.findAll)

module.exports = router
```

### 7. Δημιουργία του κεντρικού server

_Το αρχείο server.js είναι το σημείο εκκίνησης της εφαρμογής backend και ρυθμίζει το Express, τη σύνδεση με τη MongoDB, και τα routes._

Δημιουργήστε το αρχείο `server.js`:

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
app.use(express.static('dist')) // για σερβίρισμα του React build
app.use(express.json());

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use('/api/users', userRoutes)

// Εκκίνηση του server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app
```

## Δημιουργία του Frontend Login Form

_Το login form είναι το βασικό συστατικό του frontend και επιτρέπει στους χρήστες να εισάγουν τα στοιχεία τους._

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
      <button type="submit">Login</button>
    </form>
  </>
)
```

## Υλοποίηση CRUD λειτουργιών

_Για να δοκιμάσουμε την εφαρμογή, χρειαζόμαστε τη δυνατότητα δημιουργίας χρηστών, που απαιτεί την προσθήκη της λειτουργίας POST._

### 1. Προσθήκη της λειτουργίας δημιουργίας χρήστη στον controller

_Αυτή η λειτουργία επιτρέπει τη δημιουργία νέων χρηστών στη βάση δεδομένων._

Προσθέστε την ακόλουθη μέθοδο στο `controllers/user.controller.js`:

```javascript
exports.create = async (req,res) => {
  const username = req.body.username
  const password = req.body.password

  // Εδώ θα μπορούσε να προστεθεί επιπλέον έλεγχος με if

  try {
    const newUser = new User({
      username: username,
      password: password
    })
    await newUser.save()
    res.status(201).json(newUser)
  } catch(error) {
    res.status(400).json('error', error.message)
  }
}
```

### 2. Προσθήκη του αντίστοιχου route

_Το route για τη δημιουργία χρηστών αντιστοιχεί στο HTTP POST request._

Ενημερώστε το `routes/user.routes.js`:

```javascript
router.get('/', userController.findAll)
router.post('/', userController.create)
```

## Δοκιμή της εφαρμογής

_Χρησιμοποιώντας το Postman, μπορούμε να δοκιμάσουμε τα API endpoints μας για να βεβαιωθούμε ότι λειτουργούν σωστά._

1. Ξεκινήστε το server:
   ```bash
   npm run dev
   ```

2. Με το Postman, στείλτε ένα POST request στο `http://localhost:3000/api/users` με ένα JSON σώμα όπως:
   ```json
   {
     "username": "testuser",
     "password": "testpassword"
   }
   ```

3. Επιβεβαιώστε ότι η απάντηση περιέχει τον νέο χρήστη με ένα ID από τη MongoDB.

4. Στείλτε ένα GET request στο `http://localhost:3000/api/users` για να δείτε όλους τους χρήστες.

## Επόμενα βήματα

Μετά από αυτή τη βασική υλοποίηση, μπορείτε να:

1. Προσθέσετε κρυπτογράφηση κωδικών με bcrypt
2. Υλοποιήσετε JWT αυθεντικοποίηση
3. Δημιουργήσετε ένα middleware για την προστασία των routes
4. Συνδέσετε το frontend με το backend
5. Προσθέσετε επιπλέον λειτουργίες όπως reset password

Καλή ανάπτυξη! -->