import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import QuestGenerator from './pages/QuestGenerator/QuestGenerator';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import './App.css';


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        {/* Ambient background glow effect */}
        <div className="ambient-glow" aria-hidden="true" />
        
        <Header />
        
        {/* Der #center Container hält den Inhalt mittig, egal welche Seite geladen wird */}
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
      </BrowserRouter>
    </UserProvider>
  );
}


export default App;
