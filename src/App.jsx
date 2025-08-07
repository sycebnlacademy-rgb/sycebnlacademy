import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { initializeDefaultUsers } from './utils/initializeDefaultUsers';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ModulesPage from './pages/ModulesPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ChapterPage from './pages/ChapterPage';
import PaymentPage from './pages/PaymentPage';
import CertificatePage from './pages/CertificatePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminModules from './pages/AdminModules';
import './App.css';

function App() {
  // Initialiser les utilisateurs par défaut au démarrage
  useEffect(() => {
    initializeDefaultUsers();
  }, []);
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Pages sans layout */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Pages d'administration sans layout */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/modules" element={<AdminModules />} />
              
              {/* Pages avec layout */}
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/modules" element={<ModulesPage />} />
                    <Route path="/module/:moduleId" element={<ModuleDetailPage />} />
                    <Route path="/module/:moduleId/chapter/:chapterId" element={<ChapterPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/certificate" element={<CertificatePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
