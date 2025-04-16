const UserLogedInView = ({ handleLogout }) => {
  return (
    <>
      <h1>Welcome user</h1>
      <button onClick={handleLogout}>log out</button>
    </>
  )
}

export default UserLogedInView