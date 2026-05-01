import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('utilisateur');
    const adminStr = localStorage.getItem('admin');
    if (token && userStr) setUtilisateur(JSON.parse(userStr));
    if (token && adminStr) setAdmin(JSON.parse(adminStr));
    setLoading(false);
  }, []);

  const loginCitoyen = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('utilisateur', JSON.stringify(user));
    setUtilisateur(user);
  };

  const loginAdmin = (token, adminData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.clear();
    setUtilisateur(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ utilisateur, admin, loginCitoyen, loginAdmin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
