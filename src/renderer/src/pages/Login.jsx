import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { AppContext } from '../App'

const initialFormData = {
  email: '',
  password: ''
}

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const { backendURL } = useContext(AppContext)

  const handleFormSubmit = () => {
    axios
      .post(`${backendURL}/user/login`, formData)
      .then(({ data }) => navigate(`/profile/${data.id}`))
      .catch((err) => {
        console.log(err.response.data)
      })
  }

  return (
    <div>
      <h1>Login Page</h1>
      <div>
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
        <input type="submit" onClick={handleFormSubmit} value="Login" />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/">Go to home page</Link>
      </div>
    </div>
  )
}

export default Login
