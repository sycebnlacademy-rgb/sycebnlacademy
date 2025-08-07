import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clé de chiffrement pour les données sensibles
  const ENCRYPTION_KEY = 'sycebnl-platform-2024';

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const loadUser = () => {
      try {
        const encryptedUserData = localStorage.getItem('sycebnl_user');
        if (encryptedUserData) {
          const bytes = CryptoJS.AES.decrypt(encryptedUserData, ENCRYPTION_KEY);
          const userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        localStorage.removeItem('sycebnl_user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sauvegarder l'utilisateur dans le localStorage
  const saveUser = (userData) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(userData), ENCRYPTION_KEY).toString();
      localStorage.setItem('sycebnl_user', encrypted);
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données utilisateur:', error);
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      // Vérifier si l'email existe déjà
      const existingUsers = getUsers();
      if (existingUsers.find(u => u.email === userData.email)) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Créer un nouvel utilisateur
      const newUser = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: CryptoJS.SHA256(userData.password).toString(),
        isPremium: false,
        isAdmin: userData.email === 'admin@sycebnl.com', // Admin par défaut
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Sauvegarder dans la liste des utilisateurs
      const users = [...existingUsers, newUser];
      localStorage.setItem('sycebnl_users', JSON.stringify(users));

      // Connecter l'utilisateur
      const userForSession = { ...newUser };
      delete userForSession.password;
      saveUser(userForSession);

      return { success: true, user: userForSession };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      const users = getUsers();
      const hashedPassword = CryptoJS.SHA256(password).toString();
      
      const user = users.find(u => u.email === email && u.password === hashedPassword);
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Mettre à jour la dernière connexion
      user.lastLogin = new Date().toISOString();
      const updatedUsers = users.map(u => u.id === user.id ? user : u);
      localStorage.setItem('sycebnl_users', JSON.stringify(updatedUsers));

      // Connecter l'utilisateur
      const userForSession = { ...user };
      delete userForSession.password;
      saveUser(userForSession);

      return { success: true, user: userForSession };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('sycebnl_user');
    setUser(null);
  };

  // Mettre à jour le statut premium (désactivé - seuls les admins peuvent activer)
  const upgradeToPremium = () => {
    // Cette fonction est désactivée pour empêcher l'auto-activation
    // Seuls les administrateurs peuvent activer le mode premium
    console.warn('L\'activation du mode premium est désactivée pour les utilisateurs');
    return { success: false, error: 'L\'activation du mode premium nécessite une approbation administrative' };
  };

  // Obtenir tous les utilisateurs
  const getUsers = () => {
    try {
      const users = localStorage.getItem('sycebnl_users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  };

  // Mettre à jour le profil utilisateur
  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      
      // Mettre à jour dans la liste des utilisateurs
      const users = getUsers();
      const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...updates } : u);
      localStorage.setItem('sycebnl_users', JSON.stringify(updatedUsers));
      
      // Mettre à jour l'utilisateur connecté
      saveUser(updatedUser);
    }
  };

  // Demander l'approbation premium par l'admin
  const requestPremiumApproval = () => {
    if (user && !user.isPremium) {
      try {
        const existingApprovals = localStorage.getItem('sycebnl_pending_approvals');
        const approvals = existingApprovals ? JSON.parse(existingApprovals) : [];
        
        // Vérifier si une demande existe déjà
        const existingRequest = approvals.find(a => a.userId === user.id);
        if (existingRequest) {
          return { success: false, error: 'Une demande est déjà en cours de traitement' };
        }

        // Créer une nouvelle demande
        const newApproval = {
          id: Date.now().toString(),
          userId: user.id,
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`,
          requestDate: new Date().toISOString(),
          status: 'pending'
        };

        approvals.push(newApproval);
        localStorage.setItem('sycebnl_pending_approvals', JSON.stringify(approvals));
        
        return { success: true, message: 'Demande d\'approbation envoyée avec succès' };
      } catch (error) {
        return { success: false, error: 'Erreur lors de l\'envoi de la demande' };
      }
    }
    return { success: false, error: 'Utilisateur non connecté ou déjà premium' };
  };

  // Fonction admin pour activer le mode premium d'un utilisateur
  const activateUserPremium = (userId) => {
    if (!user || !user.isAdmin) {
      return { success: false, error: 'Accès administrateur requis' };
    }

    try {
      const users = getUsers();
      const userToUpdate = users.find(u => u.id === userId);
      
      if (!userToUpdate) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }

      // Mettre à jour le statut premium
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, isPremium: true } : u
      );
      localStorage.setItem('sycebnl_users', JSON.stringify(updatedUsers));

      // Mettre à jour les demandes d'approbation
      const existingApprovals = localStorage.getItem('sycebnl_pending_approvals');
      if (existingApprovals) {
        const approvals = JSON.parse(existingApprovals);
        const updatedApprovals = approvals.map(a => 
          a.userId === userId ? { ...a, status: 'approved', approvedDate: new Date().toISOString() } : a
        );
        localStorage.setItem('sycebnl_pending_approvals', JSON.stringify(updatedApprovals));
      }

      return { success: true, message: `Mode premium activé pour ${userToUpdate.firstName} ${userToUpdate.lastName}` };
    } catch (error) {
      return { success: false, error: 'Erreur lors de l\'activation du mode premium' };
    }
  };

  // Fonction admin pour refuser une demande premium
  const rejectUserPremium = (userId) => {
    if (!user || !user.isAdmin) {
      return { success: false, error: 'Accès administrateur requis' };
    }

    try {
      const existingApprovals = localStorage.getItem('sycebnl_pending_approvals');
      if (existingApprovals) {
        const approvals = JSON.parse(existingApprovals);
        const updatedApprovals = approvals.map(a => 
          a.userId === userId ? { ...a, status: 'rejected', rejectedDate: new Date().toISOString() } : a
        );
        localStorage.setItem('sycebnl_pending_approvals', JSON.stringify(updatedApprovals));
      }

      return { success: true, message: 'Demande refusée avec succès' };
    } catch (error) {
      return { success: false, error: 'Erreur lors du refus de la demande' };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    upgradeToPremium,
    updateProfile,
    requestPremiumApproval,
    activateUserPremium,
    rejectUserPremium,
    isAuthenticated: !!user,
    isPremium: user?.isPremium || false,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

