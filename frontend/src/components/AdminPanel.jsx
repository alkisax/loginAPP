import { useState, useEffect  } from "react"
import axios from 'axios'
import NewUserForm from './NewUserForm'

const AdminPanel = ({url}) => {
  const [viewForm, setViewForm] = useState(false)
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get(`${url}/users`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setUsers(response.data.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); 
      }
    };

    fetchUsers();
  }, [url]);

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Only admins can see this.</p>
      {loading && <p>Loading...</p>}
      {!loading && users.length === 0 && <p>No users found</p>}
      <ul>
        {!loading && users.length !== 0 && 
          users.map((user) => {
            return (
              <li key={user.id || `${user.username}-${user.email}`}>
                {user.username} - {user.name} - {user.email} - {user.roles.join(", ")}
              </li>
            )
          })
        } 
      </ul>

      <button onClick={() => setViewForm(!viewForm)}>create user form</button>
      {viewForm && <NewUserForm url={url} />}

    </div>
  )
}

export default AdminPanel