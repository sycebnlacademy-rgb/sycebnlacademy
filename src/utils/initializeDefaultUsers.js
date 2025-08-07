import CryptoJS from 'crypto-js';

export const initializeDefaultUsers = () => {
  console.log('🔄 Initialisation des utilisateurs SYCEBNL...');
  
  // Créer les utilisateurs par défaut (toujours les recréer pour s'assurer qu'ils existent)
  const defaultUsers = [
    {
      id: 'admin-001',
      firstName: 'Admin',
      lastName: 'SYCEBNL',
      email: 'pdgcavenro@sycebnl.com',
      password: CryptoJS.SHA256('Mercedes22@').toString(),
      isPremium: true,
      isAdmin: true,
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    {
      id: 'admin-002',
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@sycebnl.com',
      password: CryptoJS.SHA256('admin123').toString(),
      isPremium: true,
      isAdmin: true,
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    {
      id: 'demo-001',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@sycebnl.com',
      password: CryptoJS.SHA256('demo123').toString(),
      isPremium: false,
      isAdmin: false,
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    {
      id: 'premium-001',
      firstName: 'Premium',
      lastName: 'User',
      email: 'premium@sycebnl.com',
      password: CryptoJS.SHA256('premium123').toString(),
      isPremium: true,
      isAdmin: false,
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  ];

  // Sauvegarder les utilisateurs par défaut
  localStorage.setItem('sycebnl_users', JSON.stringify(defaultUsers));
  
  console.log('✅ Utilisateurs par défaut créés avec succès!');
  console.log('📝 Identifiants de connexion disponibles:');
  console.log('- Admin principal: pdgcavenro@sycebnl.com / Mercedes22@');
  console.log('- Admin test: admin@sycebnl.com / admin123');
  console.log('- Demo: demo@sycebnl.com / demo123');
  console.log('- Premium: premium@sycebnl.com / premium123');
};

