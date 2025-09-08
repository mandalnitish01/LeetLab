import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import SignupPage from './page/SignupPage'

const App = () => {
  const authUser = null; //logic to check if user is authenticated or not

  
  return (
    <Routes>
      <Route
      path='/'
      element={authUser? <HomePage/> : <Navigate to='/login'/>}
      />
      <Route 
      path='/login'
      element={!authUser? <LoginPage/> : <Navigate to='/'/>}
      />
      <Route
      path='/signup'
      element={!authUser? <SignupPage/> : <Navigate to='/'/>}
      />
    </Routes>
  )
}

export default App