import './App.css'
import Login from './components/auth/Login.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { Route, Routes, Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
