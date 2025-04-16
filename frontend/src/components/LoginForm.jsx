
const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) =>{

  const googleUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/login/google/callback&response_type=code&scope=email%20profile&access_type=offline'

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

      <a href={googleUrl}>
        <button type="button">Login with Google</button>
      </a>
    </>
  )
}
export default LoginForm