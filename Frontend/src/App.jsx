import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route} from "react-router-dom";


import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SettingPage from './pages/SettingPage';
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LogInPage';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Tailwind classes added */}
      <Navbar />

      <main className="container mx-auto px-4 py-8"> {/* Container with padding */}
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/signup' element={<SignUpPage />}/>
          <Route path='/login' element={<LogInPage />}/>
          <Route path='/settings' element={<SettingPage />}/>
          <Route path='/profile' element={<ProfilePage />}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
