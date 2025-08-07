// Script de débogage pour les utilisateurs SYCEBNL
import CryptoJS from 'crypto-js';

// Fonction pour initialiser les utilisateurs par défaut
const initializeDefaultUsers = () => {
  console.log('🔍 Vérification des utilisateurs existants...');
  
  // Vérifier si les utilisateurs par défaut existent déjà
  const existingUsers = localStorage.getItem('sycebnl_users');
  if (existingUsers) {
    const users = JSON.parse(existingUsers);
    console.log('📋 Utilisateurs existants:', users.length);
    users.forEach(user => {
      console.log(`- ${user.email} (Admin: ${user.isAdmin}, Premium: ${user.isPremium})`);
    });
    
    // Si des utilisateurs existent déjà, ne pas les écraser
    if (users.length > 0) {
      console.log('✅ Utilisateurs déjà initialisés');
      return;
    }
  }

  console.log('🔄 Création des utilisateurs par défaut...');

  // Créer les utilisateurs par défaut
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
  console.log('📝 Identifiants de connexion:');
  console.log('- Admin principal: pdgcavenro@sycebnl.com / Mercedes22@');
  console.log('- Admin test: admin@sycebnl.com / admin123');
  console.log('- Demo: demo@sycebnl.com / demo123');
  console.log('- Premium: premium@sycebnl.com / premium123');
};

// Fonction pour tester la connexion
const testLogin = (email, password) => {
  const users = JSON.parse(localStorage.getItem('sycebnl_users') || '[]');
  const hashedPassword = CryptoJS.SHA256(password).toString();
  
  const user = users.find(u => u.email === email && u.password === hashedPassword);
  
  if (user) {
    console.log(`✅ Connexion réussie pour ${email}`);
    console.log(`- Nom: ${user.firstName} ${user.lastName}`);
    console.log(`- Admin: ${user.isAdmin}`);
    console.log(`- Premium: ${user.isPremium}`);
  } else {
    console.log(`❌ Échec de connexion pour ${email}`);
    console.log(`- Mot de passe hashé: ${hashedPassword}`);
  }
};

// Exécuter le script
console.log('🚀 Démarrage du script de débogage SYCEBNL...');
initializeDefaultUsers();

console.log('\n🧪 Test des connexions...');
testLogin('pdgcavenro@sycebnl.com', 'Mercedes22@');
testLogin('admin@sycebnl.com', 'admin123');
testLogin('demo@sycebnl.com', 'demo123');
testLogin('premium@sycebnl.com', 'premium123');

console.log('\n📊 État final du localStorage:');
console.log('- sycebnl_users:', localStorage.getItem('sycebnl_users') ? '✅ Présent' : '❌ Absent');
console.log('- sycebnl_user:', localStorage.getItem('sycebnl_user') ? '✅ Présent' : '❌ Absent'); 