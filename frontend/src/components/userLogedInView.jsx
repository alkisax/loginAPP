const UserLogedInView = ({ handleLogout, userIsAdmin, handleAdminBtn }) => {
  return (
    <>
      <h1>Welcome user</h1>
      <button onClick={handleLogout}>log out</button>
      {userIsAdmin &&
        <button onClick={handleAdminBtn}>admin panel</button> 
      }
    </>
  )
}

export default UserLogedInView