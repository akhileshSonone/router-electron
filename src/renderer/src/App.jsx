import { createContext, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'

import HomePage from './pages/HomePage'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage.jsx'
import Register from './pages/Register'

export const AppContext = createContext(null)

function App() {
  const [backendURL, setBackendURL] = useState(null)

  useEffect(() => {
    const fetchURL = async () => {
      const retrievedURL = await window.api.getBackendURL()
      setBackendURL(retrievedURL)
    }

    fetchURL()
  }, [])

  return (
    <AppContext.Provider value={{ backendURL }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:id" element={<ProfilePage />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AppContext.Provider>
  )
}

export default App
