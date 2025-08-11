import './App.css'
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import Verify from './components/auth/Verify.jsx'
import BettingInterface from './components/betting/BettingInterface.jsx'
import ProfilePage from './components/profile/ProfilePage.jsx'
import { useAuth } from './contexts/AuthContext.jsx'
import { Route, Routes, Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>
  return isAuthenticated ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <div className='App'>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route 
            path="/" element={
              <PrivateRoute>
                <BettingInterface />
              </PrivateRoute>
            }
          />
          <Route 
            path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
