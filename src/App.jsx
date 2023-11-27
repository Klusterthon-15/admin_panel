import React, { useState, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Patients from './pages/Patients'
import Reports from './pages/Reports'
import Resources from './pages/Resources'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import NotFoundPage from './pages/NotFoundPage'
import NewItemForm from './components/NewItemForm'
import Alert from './components/Alert'
import { AlertContext } from './context/AlertContext'
import { useAuthContext } from './hooks/useAuthContext'

function App() {
  const {user} = useAuthContext();

  const [isBtnClicked, setIsBtnClicked] = useState(false)

  const openItemForm = ()=>{setIsBtnClicked(true)}
  const closeItemForm = ()=>{setIsBtnClicked(false)}

  const{isRecieved, type, text} = useContext(AlertContext)

  if (isRecieved){
    
  }
  return (
    <div className='App'>
      <BrowserRouter>
        {isRecieved && <Alert type={type} text={text}/>}
          {isBtnClicked && <NewItemForm handleClick={closeItemForm}/>}
          <div className="pages">
            <Routes>
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard handleClick={openItemForm} /> : <Landing/>} 
              />
              <Route 
                path="/profile" 
                element={user ? <Profile handleClick={openItemForm} /> : <Landing/>} 
              />
              <Route 
                path="/patients" 
                element={user ? <Patients handleClick={openItemForm} /> : <Landing/>} 
              />
              <Route 
                path="/resources" 
                element={user ? <Resources handleClick={openItemForm} /> : <Landing/>} 
              />
              <Route 
                path="/reports" 
                element={user ? <Reports handleClick={openItemForm} /> : <Landing/>} 
              />

              <Route 
                path="/" 
                element={user ? <Navigate to="/dashboard" /> : <Landing />} 
              />

              <Route 
                path="/signup" 
                element={<Signup />} 
              />

              <Route 
                path="/login" 
                element={user? <Navigate to="/dashboard" /> : <Login />} 
              />

              <Route 
                path="*" 
                element={<NotFoundPage />} 
              />

              
              
            </Routes>
          </div>
      </BrowserRouter>
    </div>
  )
}

export default App
