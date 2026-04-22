import { useState } from 'react';
// Hier ist der neue, saubere Import-Pfad für unsere Card-Komponente!
import Card from './components/Card/Card';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main id="center">
      <div>
        <h1>Welcome to the Dark Side</h1>
        <p>Dein neues professionelles Setup läuft.</p>
      </div>

      {/* Hier nutzen wir unsere neue Card-Komponente */}
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr', maxWidth: '500px', width: '100%', marginTop: '32px' }}>
        <Card 
          title="Theme Architektur" 
          description="Zentrale CSS-Variablen sorgen für ein einheitliches Dark-Purple-Erscheinungsbild über alle Komponenten hinweg."
        />
        
        <Card 
          title="Interaktiver State" 
          description="React state management im Einsatz. Klicke auf den Button, um den Counter zu erhöhen."
        >
          <button
            className="counter"
            onClick={() => setCount((c) => c + 1)}
            style={{ marginTop: '16px' }}
          >
            Count is {count}
          </button>
        </Card>
      </div>
    </main>
  );
}

export default App;