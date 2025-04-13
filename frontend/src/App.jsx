/* eslint-disable no-unused-vars */
import { useState } from 'react'
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