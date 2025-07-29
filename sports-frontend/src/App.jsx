import { createTheme, ThemeProvider } from '@mui/material/styles'
import './App.css'
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import Verify from './components/auth/Verify.jsx'
import Navbar from './components/layout/Navbar.jsx'
import BetDetails from './components/betting/BetDetails.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { CssBaseline } from '@mui/material'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Container } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    }, 
    secondary: {
      main: '#dc004e'
    },
    background: {
      main: '#f5f5f5'
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
          <div className='App'>
            <Navbar />
            <Container sx={{ mt: 4 }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                {/* <Route 
                  path="/"
                  element={
                    <PrivateRoute>
                      <BettingCards />
                    </PrivateRoute>
                  }
                /> */}
                <Route
                  path="/bet/:id"
                  element={
                    <PrivateRoute>
                      <BetDetails />
                    </PrivateRoute>
                  }
                />
                {/* <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                /> */}
              </Routes>
            </Container>
          </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
