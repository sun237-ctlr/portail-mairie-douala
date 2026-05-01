import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Accueil from './pages/Accueil';
import Inscription from './pages/citoyen/Inscription';
import Connexion from './pages/citoyen/Connexion';
import Dashboard from './pages/citoyen/Dashboard';
import Demande from './pages/citoyen/Demande';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/demande" element={<Demande />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
