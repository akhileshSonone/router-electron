import { Link } from 'react-router'

const HomePage = () => {
  return (
    <div>
      <h1>Home</h1>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link to={'/login'}>Login</Link>
        <Link to={'/register'}>Register</Link>
      </div>
    </div>
  )
}

export default HomePage
