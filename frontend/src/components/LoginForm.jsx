import { useState } from "react"
const LoginForm = () =>{
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const handleLogin = (event) => {
    console.log(event)

  }

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
}
export default LoginForm