import { Link, Outlet, useParams } from 'react-router'

const ProfilePage = () => {
  const { id } = useParams()

  return (
    <>
      <h3>Profile page</h3>
      <p>Welcome user: {id}</p>
      <Outlet />
      <Link to="/">Logout</Link>
    </>
  )
}

export default ProfilePage
