/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from './components/LoginForm'
import UserLogedInView from './components/userLogedInView'

const App = () => {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3000/api/message')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, [])

  return (
    <div>
      <h1>{message}</h1>
      <h1>Login APP</h1>
      {user === null && <LoginForm />}
      {user !==  null && <UserLogedInView />}
    </div>
  )
}

export default App