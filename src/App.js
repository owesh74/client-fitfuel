import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Components and Pages
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Outlets from './pages/Outlets';
import OutletMenu from './pages/OutletMenu';

// Import the Auth Provider
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        
        <main className="bg-gray-50 min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route 
              path="/outlets" 
              element={
                <ProtectedRoute>
                  <Outlets />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/outlets/:id" 
              element={
                <ProtectedRoute>
                  <OutletMenu />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;