import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { AppContext } from '../App'

const initialFormData = {
  name: '',
  email: '',
  password: ''
}

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const { backendURL } = useContext(AppContext)

  const handleFormSubmit = () => {
    axios
      .post(`${backendURL}/user/register`, formData)
      .then((_) => navigate('/login'))
      .catch((err) => console.error(err))
  }

  return (
    <div>
      <h1>Register Page</h1>
      <div>
        <input
          name="name"
          placeholder="name"
          id="name"
          type="text"
          onChange={(e) =>
            setFormData((prev) => {
              return { ...prev, name: e.target.value }
            })
          }
        />
        <input
          name="email"
          placeholder="email"
          id="email"
          type="email"
          onChange={(e) =>
            setFormData((prev) => {
              return { ...prev, email: e.target.value }
            })
          }
        />
        <input
          name="password"
          placeholder="password"
          id="password"
          type="password"
          onChange={(e) =>
            setFormData((prev) => {
              return { ...prev, password: e.target.value }
            })
          }
        />
        <input type="submit" onClick={handleFormSubmit} value="Register" />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/">Go to home page</Link>
        <span>
          Already registered? <Link to="/login">Log in.</Link>
        </span>
      </div>
    </div>
  )
}

export default Register
