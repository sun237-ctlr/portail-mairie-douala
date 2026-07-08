import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLangue } from '../context/LangueContext';
import BoutonLangue from './BoutonLangue';
import {
  FileText, PlusCircle, FolderOpen,
  Download, HelpCircle, LayoutDashboard, LogOut
} from 'lucide-react';

export default function Navbar() {
  const { utilisateur, logout } = useAuth();
  const { t } = useLangue();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const actif = (path) => location.pathname === path;

  const liens = [
    { label: t.accueil, path: '/', Icon: LayoutDashboard },
    { label: t.nouvelleDemande, path: utilisateur ? '/demande' : '/inscription', Icon: PlusCircle },
    { label: t.mesDemandes, path: utilisateur ? '/dashboard' : '/inscription', Icon: FolderOpen },
    { label: t.recupererActe, path: '/recuperer-acte', Icon: Download },
    { label: t.aide, path: '/aide', Icon: HelpCircle },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
          <FileText size={18} color="white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 leading-tight">e-Mairie Douala</p>
          <p className="text-xs text-gray-500">Ville de Douala</p>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-4 text-sm">
        {liens.map(({ label, path, Icon }) => (
          <Link key={path} to={path}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition font-medium
              ${actif(path) ? 'text-green-700 bg-green-50' : 'text-gray-600 hover:text-green-700 hover:bg-green-50'}`}>
            <Icon size={15} /> {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <BoutonLangue />
        {utilisateur ? (
          <>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                {utilisateur.prenom?.[0]}{utilisateur.nom?.[0]}
              </div>
              <span className="text-sm text-gray-700 font-medium">{utilisateur.prenom}</span>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
              <LogOut size={14} /> {t.deconnexion}
            </button>
          </>
        ) : (
          <Link to="/connexion"
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
            {t.seConnecter}
          </Link>
        )}
      </div>
    </nav>
  );
}
