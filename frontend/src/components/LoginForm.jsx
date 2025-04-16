
const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) =>{


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
        <button type="submit">login</button>
      </form>
    </>
  )
}
export default LoginForm