import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Accueil from './pages/Accueil';
import Inscription from './pages/citoyen/Inscription';
import Connexion from './pages/citoyen/Connexion';
import Dashboard from './pages/citoyen/Dashboard';
import Demande from './pages/citoyen/Demande';
import RecupererActe from './pages/citoyen/RecupererActe';
import Aide from './pages/citoyen/Aide';
import ConnexionAdmin from './pages/admin/ConnexionAdmin';
import DashboardAdmin from './pages/admin/DashboardAdmin';

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
          <Route path="/recuperer-acte" element={<RecupererActe />} />
          <Route path="/aide" element={<Aide />} />
          <Route path="/admin/connexion" element={<ConnexionAdmin />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
