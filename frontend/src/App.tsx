import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import QuestGenerator from './pages/QuestGenerator/QuestGenerator';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      {/* Ambient background glow effect */}
      <div className="ambient-glow" aria-hidden="true" />
      
      <Header />
      
      {/* Der #center Container hält den Inhalt mittig, egal welche Seite geladen wird */}
      <main id="center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quest-generator" element={<QuestGenerator />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}


export default App;
