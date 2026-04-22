import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home'; // Unser neuer Page-Import!
import './App.css';

function App() {
  return (
    <>
      <Header />
      
      {/* Der #center Container hält den Inhalt mittig, egal welche Seite geladen wird */}
      <main id="center">
        <Home />
      </main>

      <Footer />
    </>
  );
}

export default App;