import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from './components/LoginForm'
import UserLogedInView from './components/userLogedInView'

const url = 'http://localhost:3000/api'

const App = () => {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  
  useEffect(() => {
    axios.get(`${url}/message`)
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
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
      setUser(user.username)
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
    console.log("Logged out successfully")
  }

  const handleAdminBtn = () => {
    console.log("Admin clicked")    
  }

  return (
    <div>
      <h1>{message}</h1>
      <h1>Login APP</h1>
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
    </div>
  )
}

export default App