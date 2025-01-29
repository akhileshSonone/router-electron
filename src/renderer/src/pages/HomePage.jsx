import { useEffect, useState } from 'react'
import { Link } from 'react-router'

const UpdateDialog = (updateStatus) => {
  if (!updateStatus) return null

  return (
    <div className="update-status">
      {updateStatus.type === 'progress' ? (
        <div className="progress-bar">{updateStatus.message}</div>
      ) : (
        <div className={`message ${updateStatus.type}`}>{updateStatus.message}</div>
      )}
    </div>
  )
}

const HomePage = () => {
  const [updateStatus, setUpdateStatus] = useState(null)

  useEffect(() => {
    // Listen for update status changes
    const removeListener = async () => {
      const receivedStatus = await window.api.onUpdateStatus()
      setUpdateStatus(receivedStatus)
    }

    removeListener()
    return () => removeListener()
  }, [])

  return (
    <div>
      <h1>Home</h1>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link to={'/login'}>Login</Link>
        <Link to={'/register'}>Register</Link>
      </div>
      {/*{updateStatus && <UpdateDialog updateStatus={updateStatus} />}*/}
    </div>
  )
}

export default HomePage
