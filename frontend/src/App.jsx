/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from 'react-router-dom'
import GoogleSuccess from './components/GoogleSuccess'
import LoginForm from './components/LoginForm'
import UserLogedInView from './components/UserLogedInView'
import AdminPanel from './components/AdminPanel'
import ProtectedRoute from './services/ProtectedRoute'
import UserDetail from './components/UserDetail'

const url = 'http://localhost:3000/api'

const App = () => {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userIsAdmin, setUserIsAdmin] = useState(false)

  const navigate = useNavigate()
  
  // useEffect(() => {
  //   axios.get(`${url}/message`)
  //     .then(res => setMessage(res.data.message))
  //     .catch(err => console.error(err));
  // }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const roles = JSON.parse(localStorage.getItem("roles"))
    if (token && roles) {
      const userFromStorage = { token, roles }
      setUser(userFromStorage) 
      setUserIsAdmin(roles.includes("admin")) 
    }
  }, [])

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

  const handleLogout = async () => {
    localStorage.removeItem("token")
    setUser(null)
    setUserIsAdmin(false)
    console.log("Logged out successfully")
  }

  const handleAdminBtn = () => {
    navigate("/admin")   
  }

  return (
    <div>
      <h6>{message}</h6>
      <h1>Login APP</h1>
      {user && <button onClick={handleLogout}>log out</button>}

      {/* Universal Home Button */}
      <Link to="/" className="home-btn">
        <button>Home</button>
      </Link>

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
              userIsAdmin= {userIsAdmin}
              handleAdminBtn={handleAdminBtn}
            />}
          </>
        } /> 

        <Route path="/admin" element={
          <>
            <ProtectedRoute user={user} requiredRole="admin"></ProtectedRoute>
            <AdminPanel
              url={url}
            />
          </>
        } />  

        <Route path="/google-success" element={
          <GoogleSuccess setUser={setUser} setUserIsAdmin={setUserIsAdmin} />
        } />

          <Route path="/users" element={<AdminPanel url={url} />} />
          <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </div>
  )
}

export default App