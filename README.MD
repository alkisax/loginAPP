# Οδηγός δημιουργίας Full-Stack εφαρμογής Login με MERN Stack

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

Καλή ανάπτυξη!