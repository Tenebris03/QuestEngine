import { BrowserRouter, Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import QuestGenerator from './pages/QuestGenerator/QuestGenerator';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import './App.css';
import { useEffect } from 'react';

// Component to handle OAuth callback token
function OAuthCallbackHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);
  
  return null;
}

function AppRoutes() {
  return (
    <>
      <OAuthCallbackHandler />
      <Header />
      <main id="center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quest-generator" element={<QuestGenerator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        {/* Ambient background glow effect */}
        <div className="ambient-glow" aria-hidden="true" />
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}


export default App;
